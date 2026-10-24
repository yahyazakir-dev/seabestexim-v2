"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { Icon } from "./Icon";

const PRODUCTS = ["Pre-cooked tuna loins / flakes", "Frozen whole fish", "Frozen tuna loins", "Cubes & steaks", "Pet-food tuna", "Other"];

type Status = "idle" | "sending" | "sent" | "failed";

// Posts to the Cloudflare Pages Function at /api/enquiry (functions/api/enquiry.ts), which emails the directors.
// If sending fails, the buyer can still open a pre-filled email instead, so no enquiry is lost.
export function EnquiryForm() {
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setError("Please add your name, a valid email and the product you are interested in.");
      form.reportValidity();
      return;
    }
    setError("");
    const d = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const subject = `Enquiry: ${d.product} (${d.company || d.name})`;
    const body = [`Name: ${d.name}`, `Company: ${d.company}`, `Country: ${d.country}`, `Email: ${d.email}`, `Product: ${d.product}`, "", d.message].join("\n");
    setMailto(`mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      // email sending not switched on yet: hand over to the buyer's email app, as before
      if (res.status === 503) {
        setStatus("idle");
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent")
    return (
      <div className="enquiry enquiry--sent" role="status">
        <h3 className="enquiry__title">Thank you. Your enquiry is with the directors.</h3>
        <p className="enquiry__note">We reply from {site.email}, usually within one working day. For anything urgent, call {site.phone}.</p>
      </div>
    );

  return (
    <form className="enquiry" onSubmit={onSubmit} noValidate>
      <h3 className="enquiry__title">Send an enquiry</h3>
      <div className="enquiry__grid">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Country</span>
          <input name="country" autoComplete="country-name" />
        </label>
        <label className="enquiry__full">
          <span>Product</span>
          <select name="product" required defaultValue="">
            <option value="" disabled>
              Choose a product line
            </option>
            {PRODUCTS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="enquiry__full">
          <span>Specification and volume</span>
          <textarea name="message" rows={4} placeholder="Species, size or grade, cut, packing, quantity, destination port" />
        </label>
      </div>
      {/* hidden from people; bots that fill it are dropped by the server */}
      <label className="enquiry__trap" aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {error && (
        <p className="enquiry__error" role="alert">
          {error}
        </p>
      )}
      {status === "failed" && (
        <p className="enquiry__error" role="alert">
          We couldn&rsquo;t send that just now. <a href={mailto}>Email it to {site.email} instead</a>, or call {site.phone}.
        </p>
      )}
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send enquiry"} <Icon name="arrow" />
      </button>
      <p className="enquiry__note">Goes straight to the directors at {site.email}.</p>
    </form>
  );
}
