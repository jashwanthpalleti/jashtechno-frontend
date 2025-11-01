// app/pricing/page.tsx
import PricingPlans from "../components/PricingPlans";

export const metadata = {
  title: "Pricing • Jash Techno",
  description: "Subscriptions that keep your site fast, secure, and growing.",
};

export default function PricingPage() {
  return <PricingPlans />;
}
