import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import FAQSection from "./FAQSection";

export default function ContactPage({ data }: { data: any }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-20 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
          Let's Connect
        </p>

        <h1 className="text-5xl font-bold md:text-7xl">Get in Touch</h1>

        <p className="mx-auto mt-6 max-w-3xl text-muted-foreground">
          Whether you have a project in mind, a job opportunity, or just want to
          say hello — my inbox is always open.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <ContactInfo data={data} />
      </div>

      <FAQSection faq={data.faq || []} />
    </div>
  );
}
