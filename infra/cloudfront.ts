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

// TODO: pull this from Greenwood / config
function getStaticPages(compilation) {
  const { config, graph } = compilation;

  return graph.filter(
    (page) =>
      !page.isSSR ||
      (page.isSSR && page.prerender) ||
      (page.isSSR && page.prerender !== false && config.prerender) ||
      page.staticPaths,
  );
}

const graph = // @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
  (await import(new URL("../../public/graph.json", import.meta.url), { with: { type: "json" } }))
    .default;
const ssrPages = getDynamicPages({ config: { prerender: true }, graph });
const ssrRoutes = {};
const staticPages = getStaticPages({ config: { prerender: true }, graph });
const staticRoutes = {};

// TODO handle base path
ssrPages.forEach((page) => {
  const { route, segment } = page;

  if (segment?.key) {
    const basePattern = segment.pathname.replace(`/:${segment.key}/`, "");

    // Preserve the public path so the generic adapter can match it exactly.
    ssrRoutes[`${basePattern}/*`] = {
      url: gateway.url,
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

staticPages.forEach((page) => {
  const { route, hasStaticParams, staticPaths, segment } = page;

  if (hasStaticParams) {
    staticPaths.forEach((path) => {
      const { key } = segment;
      const fullPath = route.replace(`[${key}]`, path.params[key]);

      staticRoutes[fullPath] = {
        url: frontend.url,
      };
    });
  } else {
    staticRoutes[route] = {
      url: frontend.url,
    };
  }
});

// CloudFront distribution
// https://sst.dev/docs/component/aws/router
const backend = process.env.API_BACKEND_HOSTNAME ?? "";

export const router = new sst.aws.Router("AS-Website-Router", {
  domain:
    $app.stage === "production"
      ? {
          name: "www.analogstudiosri.com",
          redirects: ["analogstudios.net", "*.analogstudios.net"],
        }
      : undefined,
  routes: {
    // proxy actual API requests to our standalone backend
    "/api/events": `${backend}/api/events`,
    "/api/posts": `${backend}/api/posts`,
    "/api/artists": `${backend}/api/artists`,
    "/api/albums": `${backend}/api/albums`,
    // favor static routes first
    ...staticRoutes,
    ...ssrRoutes,
    "/*": frontend.url,
  },
  invalidation: true,
});
