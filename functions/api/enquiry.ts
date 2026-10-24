// Cloudflare Pages Function: POST /api/enquiry
// Sends the enquiry form to the directors through Zoho CPaaS (ZeptoMail) email API.
//
// Settings (Cloudflare Pages → seabestexim → Settings → Variables and Secrets):
//   ZEPTO_TOKEN  secret   Send Mail token from Zoho, e.g. "Zoho-enczapikey wSsVR6…" (the prefix is optional)
//   MAIL_FROM    text     verified sender on seabestexim.com, e.g. "noreply@seabestexim.com"
//   MAIL_TO      text     where enquiries land (default info@seabestexim.com)
//   ZEPTO_URL    text     API endpoint (default https://cpaas.zoho.com/v1.1/email; India DC: https://cpaas.zoho.in/v1.1/email)

interface Env {
  ZEPTO_TOKEN?: string;
  MAIL_FROM?: string;
  MAIL_TO?: string;
  ZEPTO_URL?: string;
}

const FIELDS = ["name", "company", "email", "country", "product", "message"] as const;
type Field = (typeof FIELDS)[number];
const LIMITS: Record<Field, number> = { name: 120, company: 160, email: 200, country: 80, product: 80, message: 5000 };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  let raw: Record<string, unknown>;
  try {
    raw = (request.headers.get("content-type") ?? "").includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Bots fill every field, including the hidden "website" one; quietly accept and drop.
  if (typeof raw.website === "string" && raw.website.trim()) return json({ ok: true });

  const d = {} as Record<Field, string>;
  for (const f of FIELDS) d[f] = String(raw[f] ?? "").trim().slice(0, LIMITS[f]);
  if (!d.name || !d.product || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return json({ ok: false, error: "invalid" }, 422);

  if (!env.ZEPTO_TOKEN || !env.MAIL_FROM) return json({ ok: false, error: "not_configured" }, 503);

  const to = env.MAIL_TO || "info@seabestexim.com";
  const token = env.ZEPTO_TOKEN.startsWith("Zoho-enczapikey") ? env.ZEPTO_TOKEN : `Zoho-enczapikey ${env.ZEPTO_TOKEN}`;
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Company", d.company || "–"],
    ["Email", d.email],
    ["Country", d.country || "–"],
    ["Product", d.product],
  ];
  const subject = `Website enquiry: ${d.product} – ${d.company || d.name}`;
  const textbody = [...rows.map(([k, v]) => `${k}: ${v}`), "", d.message || "(no message)"].join("\n");
  const htmlbody = `<table cellpadding="6" style="font:14px/1.5 Arial,sans-serif;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#33506f">${k}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table><p style="font:14px/1.6 Arial,sans-serif;white-space:pre-wrap">${esc(d.message || "(no message)")}</p>`;

  let res: Response;
  try {
    res = await fetch(env.ZEPTO_URL || "https://cpaas.zoho.com/v1.1/email", {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        from: { address: env.MAIL_FROM, name: "Sea Best Exim website" },
        to: [{ email_address: { address: to, name: "Sea Best Exim" } }],
        reply_to: [{ address: d.email, name: d.name }],
        subject,
        textbody,
        htmlbody,
      }),
    });
  } catch (err) {
    console.error("zeptomail unreachable", String(err));
    return json({ ok: false, error: "send_failed" }, 502);
  }
  if (!res.ok) {
    console.error("zeptomail", res.status, (await res.text()).slice(0, 500));
    return json({ ok: false, error: "send_failed" }, 502);
  }
  return json({ ok: true });
}
