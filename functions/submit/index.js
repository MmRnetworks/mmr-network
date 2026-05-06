/**
 * @type {import('@cloudflare/workers-types').PagesFunction}
 */

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const name = formData.get("name");
    const address = formData.get("address");
    const phone = formData.get("phone");
    const plan = formData.get("plan");
    const token = formData.get("cf-turnstile-response");

    const secret = context.env.TURNSTILE_SECRET;

    if (!secret) {
      return new Response("Missing TURNSTILE_SECRET", { status: 500 });
    }

    if (!token) {
      return new Response("Missing token", { status: 400 });
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: context.request.headers.get("CF-Connecting-IP"),
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return new Response("Verification failed", { status: 403 });
    }

    console.log("NEW APPLICATION:", {
      name,
      address,
      phone,
      plan,
    });

    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error("Submit error:", err);
    return new Response("Server error", { status: 500 });
  }
}/**
 * @type {import('@cloudflare/workers-types').PagesFunction}
 */

export async function onRequest(context) {
  try {
    const formData = await context.request.formData();

    const name = formData.get("name");
    const address = formData.get("address");
    const phone = formData.get("phone");
    const plan = formData.get("plan");
    const token = formData.get("cf-turnstile-response");

    const secret = context.env.TURNSTILE_SECRET;

    if (!secret) return new Response("Missing secret", { status: 500 });
    if (!token) return new Response("Missing token", { status: 400 });

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: context.request.headers.get("CF-Connecting-IP"),
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return new Response("Verification failed", { status: 403 });
    }

    console.log("NEW APPLICATION:", { name, address, phone, plan });

    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}