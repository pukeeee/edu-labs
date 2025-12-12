import CTASection from "@/widgets/cta/ui/CTASection";
import FeaturedCourses from "@/widgets/featured-courses/ui/FeaturedCoursesSection";
import HeroSection from "@/widgets/hero/ui/HeroSection";
import HowItWorksSection from "@/widgets/how-it-works/ui/HowItWorksSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedCourses />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}
