import { frontend } from "./static-site.ts";
import { gateway } from "./api-gateway.ts";

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
const ssrPages = getDynamicPages({ config: { prerender: true }, graph });
const ssrRoutes = {};

// TODO handle base path
ssrPages.forEach((page) => {
  const { route, segment } = page;

  if (segment?.key) {
    const basePattern = segment.pathname.replace(`/:${segment.key}/`, "");

    ssrRoutes[`${basePattern}/*`] = {
      url: gateway.url,
      rewrite: {
        regex: `^${basePattern}/(.*)$`,
        to: `/routes${basePattern}/$1`,
      },
    };
  } else {
    const routePattern = `/${route
      .split("/")
      .filter((segment) => segment !== "")
      .join("/")}`;

    ssrRoutes[route] = {
      url: gateway.url,
      rewrite: {
        regex: `^${route}$`,
        to: `/routes/${routePattern}`,
      },
    };
  }
});

// CloudFront distribution
// https://sst.dev/docs/component/aws/router
const backend = process.env.API_BACKEND_HOSTNAME ?? "";

export const router = new sst.aws.Router("AS-Website-Router", {
  domain: $app.stage === "production" ? "www.analogstudios.net" : undefined,
  routes: {
    // proxy actual API requests to our standalone backend
    "/api/events": `${backend}/api/events`,
    "/api/posts": `${backend}/api/posts`,
    "/api/*": gateway.url,
    ...ssrRoutes,
    "/*": frontend.url,
  },
  invalidation: true,
});
