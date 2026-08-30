const name = "ContactFormEmail";
const sender = process.env.CONTACT_EMAIL ?? "";

export const email =
  $app.stage === "production"
    ? new sst.aws.Email(name, {
        sender,
        transform: {
          identity: (_args, opts) => {
            opts.import = sender;
          },
        },
      })
    : sst.aws.Email.get(name, sender);
