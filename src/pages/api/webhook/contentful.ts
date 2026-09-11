import * as AWS from "@aws-sdk/client-cloudfront";
import { Resource } from "sst";
import { Temporal } from "temporal-polyfill";

const WEBHOOK_HEADER_NAME = "x-contentful_webhook_access_token" as const;
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

interface ContentfulWebhookPayload {
  sys?: {
    contentType?: {
      sys?: {
        id?: unknown;
      };
    };
  };
}

export async function handler(request: Request) {
  const { headers, method } = request;

  if (method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  const accessToken = headers.has(WEBHOOK_HEADER_NAME) ? headers.get(WEBHOOK_HEADER_NAME) : null;

  if (accessToken !== process.env.CONTENTFUL_WEBHOOK_ACCESS_TOKEN) {
    return new Response("Not Found", { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ msg: "Invalid JSON body" }, { status: 400 });
  }

  const entity = (body as ContentfulWebhookPayload)?.sys?.contentType?.sys?.id;

  if (typeof entity !== "string" || !entity) {
    return Response.json({ msg: "Missing Contentful content type" }, { status: 400 });
  }

  try {
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
    const cfClient = new AWS.CloudFront({});
    await cfClient.createInvalidation(params);

    return Response.json({ msg: "success" });
  } catch (e) {
    return Response.json({ msg: e }, { status: 500 });
  }
}
