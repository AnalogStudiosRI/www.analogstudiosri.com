import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert";

const sender = "studio@example.com";
const sendMock = mock.fn(async (command: unknown) => {
  void command;
  return {};
});

class SESv2ClientMock {
  send = sendMock;
}

class SendEmailCommandMock {
  input: unknown;

  constructor(input: unknown) {
    this.input = input;
  }
}

mock.module("sst", {
  namedExports: {
    Resource: {
      MyEmail: { sender },
    },
  },
});

mock.module("@aws-sdk/client-sesv2", {
  namedExports: {
    SESv2Client: SESv2ClientMock,
    SendEmailCommand: SendEmailCommandMock,
  },
});

// Install the ESM mocks before loading the module under test.
const { handler } = await import("#pages/api/contact.ts");

describe("Contact API", () => {
  beforeEach(() => {
    sendMock.mock.resetCalls();
  });

  it("should return successful on a complete form submission", async () => {
    const subject = "Hello Analog Studios!";
    const email = "me@example.com";
    const message = "How are you?  Will you record me please? :)";
    const request = new Request("http://localhost:8080/api/contact", {
      method: "POST",
      body: new URLSearchParams({ subject, email, message }).toString(),
      headers: new Headers({
        "content-type": "application/x-www-form-urlencoded",
      }),
    });

    const response = await handler(request);

    assert.strictEqual(response.ok, true);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.statusText, "Successful submission");
    assert.strictEqual(sendMock.mock.callCount(), 1);

    const command = sendMock.mock.calls[0].arguments[0] as SendEmailCommandMock;

    assert.deepStrictEqual(command.input, {
      FromEmailAddress: sender,
      Destination: {
        ToAddresses: [sender],
      },
      Content: {
        Simple: {
          Subject: {
            Data: `[website contact form] ${subject}`,
          },
          Body: {
            Text: {
              Data: [`New message from: ${email}`, "", message.trim()].join("\n"),
            },
          },
        },
      },
    });
  });

  it("should detect when there are missing required fields", async () => {
    const request = new Request("http://localhost:8080/api/contact", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/x-www-form-urlencoded",
      }),
    });

    const response = await handler(request);

    assert.strictEqual(response.ok, false);
    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.statusText, "Incomplete form submission");
    assert.strictEqual(sendMock.mock.callCount(), 0);
  });

  it("should detect a honeypot submission by returning a 'blank' response", async () => {
    const info = "I am not a bot, I promise";
    const request = new Request("http://localhost:8080/api/contact", {
      method: "POST",
      body: new URLSearchParams({ info }).toString(),
      headers: new Headers({
        "content-type": "application/x-www-form-urlencoded",
      }),
    });

    const response = await handler(request);

    assert.strictEqual(response.ok, true);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.statusText, "");
    assert.strictEqual(sendMock.mock.callCount(), 0);
  });
});
