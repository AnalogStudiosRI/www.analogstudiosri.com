import { frontend } from "./static-site.ts";
import { addApiRoutes, gateway } from "./api-gateway.ts";

// TODO: pull this from Greenwood / config
function getDynamicPages(compilation) {
  const { config, graph } = compilation;

  return graph.filter(
    (page) => page.isSSR && !page.staticPaths && !(page.staticExport ?? config.staticExport),
  );
}

// TODO: pull this from Greenwood / config
function getStaticPages(compilation) {
  const { config, graph } = compilation;

  return graph.filter(
    (page) => !page.isSSR || page.staticPaths || (page.staticExport ?? config.staticExport),
  );
}

const graph = // @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
  (await import(new URL("../../public/graph.json", import.meta.url), { with: { type: "json" } }))
    .default;
const ssrPages = getDynamicPages({ config: { staticExport: false }, graph });
const ssrRoutes = {};
const staticPages = getStaticPages({ config: { staticExport: false }, graph });
const staticRoutes = {};

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

export const router = new sst.aws.Router("AS-Website-Router", {
  domain:
    $app.stage === "production"
      ? {
          name: "www.analogstudiosri.com",
          redirects: ["analogstudios.net", "*.analogstudios.net"],
        }
      : undefined,
  routes: {
    "/api/*": gateway.url,
    // favor static routes first
    ...staticRoutes,
    ...ssrRoutes,
    "/*": frontend.url,
  },
  invalidation: true,
});

addApiRoutes(router);
