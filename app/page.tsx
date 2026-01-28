import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Navbar,
  Hero,
  Preview,
  Features,
  Testimonials,
  CTA,
  Footer,
} from "@/components/landing";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <Preview />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
