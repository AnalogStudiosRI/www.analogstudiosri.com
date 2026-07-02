import { frontend } from "./static";
import { api } from "./api-routes";

// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const ssrPages = (
  await import(new URL("../../public/graph.json", import.meta.url), { with: { type: "json" } })
).default.filter((page) => page.isSSR && !page.hasStaticParams);
const ssrRoutes = {};

// TODO handle base path
ssrPages.forEach((page) => {
  const { route, segment } = page;

  if (segment?.key) {
    const basePattern = segment.pathname.replace(`/:${segment.key}/`, "");

    ssrRoutes[`${basePattern}/*`] = {
      url: api.url,
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
      url: api.url,
      rewrite: {
        regex: `^${route}$`,
        to: `/routes/${routePattern}`,
      },
    };
  }
});

// https://sst.dev/docs/component/aws/router
export const router = new sst.aws.Router("MyRouter", {
  routes: {
    "/api/*": api.url,
    ...ssrRoutes,
    "/*": frontend.url,
  },
  invalidation: true,
});
