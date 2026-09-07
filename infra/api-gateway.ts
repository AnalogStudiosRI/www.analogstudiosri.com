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
      CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE ?? "",
      CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ?? "",
      CONTENTFUL_WEBHOOK_ACCESS_TOKEN: process.env.CONTENTFUL_WEBHOOK_ACCESS_TOKEN ?? "",
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      DATABASE_TOKEN: process.env.DATABASE_TOKEN ?? "",
    },
  });
});

// API routes are added after the router is created so the Contentful webhook can link to
// that stage's CloudFront distribution without creating a circular module dependency.
export function addApiRoutes(router) {
  const contentfulCache = new sst.Linkable("ContentfulCache", {
    properties: {
      distributionId: router.distributionID,
    },
    include: [
      sst.aws.permission({
        actions: ["cloudfront:CreateInvalidation"],
        resources: [router.nodes.cdn.apply((cdn) => cdn.nodes.distribution.arn)],
      }),
    ],
  });

  apiRoutes.forEach((apiRoute) => {
    const [route, { id }] = apiRoute;

    // map one-off resources for contact and webhook APIs
    const link = [
      ...(id === "contact" ? [email] : []),
      ...(id === "webhook-contentful" ? [contentfulCache] : []),
    ];

    // swap out [] for {} in route for AWS API Gateway compatibility
    gateway.route(`ANY ${route.replace("[", "{").replace("]", "}")}`, {
      bundle: `.aws-output/api/${id}`,
      handler: "index.handler",
      runtime: RUNTIME,
      link,
      environment: {
        CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE ?? "",
        CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ?? "",
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        DATABASE_TOKEN: process.env.DATABASE_TOKEN ?? "",
        ...(id === "webhook-contentful"
          ? {
              CONTENTFUL_WEBHOOK_ACCESS_TOKEN: process.env.CONTENTFUL_WEBHOOK_ACCESS_TOKEN ?? "",
            }
          : {}),
      },
    });
  });
}
