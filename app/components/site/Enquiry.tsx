"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/components/site/enquiry-actions";

const initialState: EnquiryState = { status: "idle" };

export default function Enquiry() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);

  return (
    <section id="enquiries" className="section section--alt">
      <div className="container">
        <h2 className="section-heading">Get in Touch</h2>
        {state.status === "success" ? (
          <p className="enquiry-success">
            Thanks — we&apos;ve got your message and will be in touch soon.
          </p>
        ) : (
          <form action={formAction} className="enquiry-form">
            {/* Honeypot — real visitors never see or fill this in; bots do. */}
            <label className="enquiry-honeypot" aria-hidden="true">
              Leave this field blank
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="enquiry-form-row">
              <label>
                Name
                <input type="text" name="name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" required />
              </label>
            </div>
            <label>
              Message
              <textarea name="message" required />
            </label>
            {state.status === "error" && <p className="enquiry-error">{state.error}</p>}
            <button type="submit" className="btn" disabled={pending}>
              {pending ? "Sending..." : "Send enquiry"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
