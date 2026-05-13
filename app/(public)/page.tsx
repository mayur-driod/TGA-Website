import HeroSection from "@/components/sections/HeroSection"
import SplashScreen from "@/components/common/SplashScreen"
import StatsBar from "@/components/sections/StatsBar"
import ActivitiesGrid from "@/components/sections/ActivitiesGrid"
import EventsPreview from "@/components/sections/EventsPreview"
import BiodiversityPreview from "@/components/sections/BiodiversityPreview"
import PartnersBar from "@/components/sections/PartnersBar"
import FaqSection from "@/components/sections/FaqSection"
import JoinSection from "@/components/sections/JoinSection"

export default function PublicHomePage() {
	return (
		<>
			<SplashScreen />
			<HeroSection />
			<StatsBar />
			<ActivitiesGrid />
			<EventsPreview />
			<BiodiversityPreview />
			<PartnersBar />
			<FaqSection />
			<JoinSection />
		</>
	)
}
