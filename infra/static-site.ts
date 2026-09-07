import { email } from "./ses.ts";

// Production assets can be cached for a year; preview assets only need a short review window.
const assetRetention = $app.stage === "production" ? "400 days" : "30 days";

// TODO could this just be an S3 bucket?
// https://sst.dev/docs/component/aws/static-site
export const frontend = new sst.aws.StaticSite("AS-Website-Static", {
  path: "public",
  assets: {
    purge: false,
  },
  environment: sst.Linkable.env([email]),
  edge: {
    viewerRequest: {
      injection: `
        const path = event.request.uri;

        if (path === "/admin" || path.startsWith("/admin/")) {
          return {
            statusCode: 404,
            statusDescription: "Not Found",
            headers: {
              "content-type": {
                value: "text/plain; charset=utf-8"
              },
              "cache-control": {
                value: "no-store"
              }
            },
            body: {
              encoding: "text",
              data: "Not Found"
            }
          };
        }
      `,
    },
  },
  transform: {
    assets: {
      lifecycle: [
        {
          id: "expire-retained-assets",
          expiresIn: assetRetention,
        },
      ],
    },
  },
});
