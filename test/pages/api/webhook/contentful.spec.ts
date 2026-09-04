import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

process.env.AWS_ACCESS_KEY_ID = "aws-access-key";
process.env.AWS_SECRET_ACCESS_KEY = "aws-secret-key";
process.env.AWS_CLOUDFRONT_ID = "distribution-id";
process.env.CONTENTFUL_WEBHOOK_ACCESS_TOKEN = "webhook-token";

const clientConfigs: unknown[] = [];
const createInvalidationMock = mock.fn(async (params: unknown) => {
  void params;
  return {};
});

class CloudFrontMock {
  createInvalidation = createInvalidationMock;

  constructor(config: unknown) {
    clientConfigs.push(config);
  }
}

mock.module("@aws-sdk/client-cloudfront", {
  namedExports: {
    CloudFront: CloudFrontMock,
  },
});

// Install the ESM mock before loading the module under test.
const { handler } = await import("#pages/api/webhook/contentful.ts");

function contentfulRequest(accessToken?: string) {
  const headers = new Headers({ "content-type": "application/json" });

  if (accessToken) {
    headers.set("x-contentful_webhook_access_token", accessToken);
  }

  return new Request("http://localhost:8080/api/webhook/contentful", {
    method: "POST",
    headers,
    body: JSON.stringify({ sys: { contentType: { sys: { id: "event" } } } }),
  });
}

describe("Contentful Webhook API", () => {
  beforeEach(() => {
    createInvalidationMock.mock.resetCalls();
    createInvalidationMock.mock.mockImplementation(async (params: unknown) => {
      void params;
      return {};
    });
    clientConfigs.length = 0;
  });

  it("should invalidate the API cache for an authorized Contentful webhook", async () => {
    const response = await handler(contentfulRequest("webhook-token"));

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.headers.get("content-type"), "application/json");
    assert.deepStrictEqual(await response.json(), { msg: "success" });
    assert.deepStrictEqual(clientConfigs, [
      {
        region: "us-east-1",
        accessKeyId: "aws-access-key",
        secretAccessKey: "aws-secret-key",
        distributionId: "distribution-id",
      },
    ]);
    assert.strictEqual(createInvalidationMock.mock.callCount(), 1);

    const params = createInvalidationMock.mock.calls[0].arguments[0] as {
      DistributionId: string;
      InvalidationBatch: {
        CallerReference: string;
        Paths: { Quantity: number; Items: string[] };
      };
    };

    assert.strictEqual(params.DistributionId, "distribution-id");
    assert.match(params.InvalidationBatch.CallerReference, /^\d+$/);
    assert.deepStrictEqual(params.InvalidationBatch.Paths, {
      Quantity: 1,
      Items: ["/api/events*"],
    });
  });

  it("should return not found when the access token is missing", async () => {
    const response = await handler(contentfulRequest());

    assert.strictEqual(response.status, 404);
    assert.strictEqual(await response.text(), "Not Found");
    assert.strictEqual(createInvalidationMock.mock.callCount(), 0);
  });

  it("should return not found when the access token is invalid", async () => {
    const response = await handler(contentfulRequest("invalid-token"));

    assert.strictEqual(response.status, 404);
    assert.strictEqual(await response.text(), "Not Found");
    assert.strictEqual(createInvalidationMock.mock.callCount(), 0);
  });

  it("should return an error when the cache invalidation fails", async () => {
    createInvalidationMock.mock.mockImplementationOnce(async (params: unknown) => {
      void params;
      throw "CloudFront unavailable";
    });

    const response = await handler(contentfulRequest("webhook-token"));

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.headers.get("content-type"), "application/json");
    assert.deepStrictEqual(await response.json(), { msg: "CloudFront unavailable" });
  });
});
