globalThis.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementsByTagName("form")[0];

  form.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    console.log("send the form!");

    if (event.currentTarget) {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const subject = formData.has("subject") ? (formData.get("subject") as string) : null;
      const email = formData.has("email") ? (formData.get("email") as string) : null;
      const message = formData.has("message") ? (formData.get("message") as string) : null;
      const info = formData.has("info") ? (formData.get("info") as string) : null;

      if (subject && email && message && !info) {
        const response = await fetch("/api/contact", {
          method: "POST",
          body: new URLSearchParams({ subject, email, message }).toString(),
          headers: new Headers({
            "content-type": "application/x-www-form-urlencoded",
          }),
        });

        const feedback = document.getElementById("feedback") as HTMLParagraphElement;

        feedback.textContent = response.ok
          ? "Thank you for you contacting us!"
          : "Sorry, there was an error with your submission.";

        feedback.style.display = "block";
      } else {
        console.warn("invalid form submission detected");
      }
    } else {
      console.warn("form element not found!!!");
    }
  });
});
