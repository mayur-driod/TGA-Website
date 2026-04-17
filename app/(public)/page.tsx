import HeroSection from "@/components/sections/HeroSection"
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
