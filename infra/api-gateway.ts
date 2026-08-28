import { email } from "./ses.ts";

// API Gateway
// https://sst.dev/docs/component/aws/apigatewayv2/
export const gateway = new sst.aws.ApiGatewayV2("AS-Website-Gateway");

const RUNTIME = "nodejs24.x";

// TODO: pull this from Greenwood / config
function getDynamicPages(compilation) {
  const { config, graph } = compilation;

  // would be nice to do this without the extra conditional (good first issue)
  return graph.filter((page) => {
    let isSsrRoute = page.isSSR && !page.staticPaths && page.prerender !== true;

    if (isSsrRoute && config.prerender && page.prerender !== false) {
      isSsrRoute = false;
    }

    return isSsrRoute;
  });
}

const graph = // @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
  (await import(new URL("../../public/graph.json", import.meta.url), { with: { type: "json" } }))
    .default;
// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const apiRoutes = (
  await import(new URL("../../public/manifest.json", import.meta.url), { with: { type: "json" } })
).default.apis.value;
const ssrPages = getDynamicPages({ config: { prerender: true }, graph });

// https://sst.dev/docs/component/aws/apigatewayv2
// https://sst.dev/docs/component/aws/function
// NOTE: API Gateway routes can NOT end in a trailing /
ssrPages.forEach((page) => {
  const { id, segment, route } = page;
  const routePattern = segment?.key
    ? segment.pathname.replace(`:${segment.key}/`, "{proxy+}") // we use proxy+ to match everything, including trailing /
    : `/${route
        .split("/")
        .filter((segment) => segment !== "")
        .join("/")}`;

  gateway.route(`GET /routes${routePattern}`, {
    bundle: `.aws-output/routes/${id}`,
    handler: "index.handler",
    runtime: RUNTIME,
    environment: {
      API_BACKEND_HOSTNAME: process.env.API_BACKEND_HOSTNAME ?? "",
      CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE ?? "",
      CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ?? "",
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      DATABASE_TOKEN: process.env.DATABASE_TOKEN ?? "",
    },
  });
});

apiRoutes.forEach((apiRoute) => {
  const [route, { id }] = apiRoute;

  // map SES to contact API route
  const link = id === "contact" ? [email] : [];

  // swap out [] for {} in route for AWS API Gateway compatibility
  gateway.route(`ANY ${route.replace("[", "{").replace("]", "}")}`, {
    bundle: `.aws-output/api/${id}`,
    handler: "index.handler",
    runtime: RUNTIME,
    link,
  });
});
