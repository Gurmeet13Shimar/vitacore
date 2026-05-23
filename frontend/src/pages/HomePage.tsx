import { useNavigate } from "react-router-dom";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <HeroGeometric
      badge="Dual Twin Platform"
      title1="One Vision."
      title2="Two Worlds."
      subtitle="Where digital meets physical. A unified platform for dual-twin synchronisation at every scale."
      ctaLabel="Get Started"
      ctaSecondary="See How It Works"
      onCtaClick={() => navigate("/dashboard")}
      onSecondaryClick={() => navigate("/simulator")}
    />
  );
}
