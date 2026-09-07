import { email } from "./ses.ts";

// TODO could this just be an S3 bucket?
// https://sst.dev/docs/component/aws/static-site
export const frontend = new sst.aws.StaticSite("AS-Website-Static", {
  path: "public",
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
});
