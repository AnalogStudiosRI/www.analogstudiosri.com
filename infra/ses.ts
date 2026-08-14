// TODO: rename from MyEmail (to ContactEmail)
export const email = new sst.aws.Email("MyEmail", {
  sender: process.env.CONTACT_EMAIL ?? "",
});
