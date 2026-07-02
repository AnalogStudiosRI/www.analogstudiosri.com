import { frontend } from "./static.ts";
import { api } from "./api-routes.ts";

// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const ssrPages = (
  await import(new URL("../../public/graph.json", import.meta.url), { with: { type: "json" } })
).default.filter((page) => page.isSSR && !page.staticPaths);
const ssrRoutes = {};

// TODO handle base path
ssrPages.forEach((page) => {
  const { route, id } = page;

  ssrRoutes[page.route] = {
    url: api.url,
    rewrite: {
      regex: `^${route}$`,
      to: `/routes/${id}`,
    },
  };
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
