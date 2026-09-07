import * as AWS from "@aws-sdk/client-cloudfront";
import { Resource } from "sst";
import { Temporal } from "temporal-polyfill";

interface CloudfrontInvalidationParams {
  DistributionId: string;
  InvalidationBatch: {
    CallerReference: string;
    Paths: {
      Quantity: number;
      Items: Array<string>;
    };
  };
}

export async function handler(request: Request) {
  const cfClient = new AWS.CloudFront({});
  const body = await request.json();
  const headers = request.headers;
  const entity = body?.sys.contentType.sys.id || "";
  const accessToken = headers.has("x-contentful_webhook_access_token")
    ? headers.get("x-contentful_webhook_access_token")
    : null;

  // invalidate index.html in Cloudfront
  const params: CloudfrontInvalidationParams = {
    DistributionId: Resource.ContentfulCache.distributionId,
    InvalidationBatch: {
      CallerReference: Temporal.Now.instant().epochMilliseconds.toString(),
      Paths: {
        Quantity: 1,
        Items: [`/api/${entity}s*`],
      },
    },
  };

  if (accessToken === process.env.CONTENTFUL_WEBHOOK_ACCESS_TOKEN) {
    try {
      await cfClient.createInvalidation(params);

      return new Response(JSON.stringify({ msg: "success" }), {
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    } catch (e) {
      return new Response(JSON.stringify({ msg: e }), {
        status: 500,
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    }
  } else {
    return new Response("Not Found", {
      status: 404,
    });
  }
}
