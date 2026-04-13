import { Navbar1 } from "@/components/ui/navbar"

export default function PublicHomePage() {
	return (
		<main className="min-h-screen bg-background">
			<Navbar1 isLoggedIn />
		</main>
	)
}
