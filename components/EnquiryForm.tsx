"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { Icon } from "./Icon";

const PRODUCTS = ["Pre-cooked tuna loins / flakes", "Frozen whole fish", "Frozen tuna loins", "Cubes & steaks", "Pet-food tuna", "Other"];

// No backend yet: the form composes an email in the visitor's mail app.
export function EnquiryForm() {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setError("Please add your name, a valid email and the product you are interested in.");
      form.reportValidity();
      return;
    }
    setError("");
    const d = new FormData(form);
    const subject = `Enquiry: ${d.get("product")} (${d.get("company") || d.get("name")})`;
    const body = [
      `Name: ${d.get("name")}`,
      `Company: ${d.get("company")}`,
      `Country: ${d.get("country")}`,
      `Email: ${d.get("email")}`,
      `Product: ${d.get("product")}`,
      "",
      `${d.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

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
      {error && (
        <p className="enquiry__error" role="alert">
          {error}
        </p>
      )}
      <button className="btn" type="submit">
        Compose email <Icon name="arrow" />
      </button>
      <p className="enquiry__note">Opens your email app with the details filled in, addressed to {site.email}.</p>
    </form>
  );
}
