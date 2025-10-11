import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact • Jash Techno",
  description: "Get in touch with Jash Techno.",
};

export default function ContactPage() {
  return (
    <main className="section">
      <div className="section-inner max-w-3xl">
        <h1 className="section-title">Contact Us</h1>
        <ContactForm />
      </div>
    </main>
  );
}
