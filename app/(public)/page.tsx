import Image from "next/image";

export default function PublicHomePage() {
	return (
		<div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-8">
			<main className="flex w-full max-w-3xl flex-col items-center justify-between rounded-2xl border border-border/80 bg-card/90 px-8 py-16 shadow-sm backdrop-blur sm:items-start sm:px-12">
				<Image
					className="opacity-85"
					src="/next.svg"
					alt="Next.js logo"
					width={100}
					height={20}
					priority
				/>
				<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
					<h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
						To get started, edit the page.tsx file.
					</h1>
					<p className="max-w-md text-lg leading-8 text-muted-foreground">
						Looking for a starting point or more instructions? Head over to{" "}
						<a
							href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							className="font-medium text-foreground hover:text-primary"
						>
							Templates
						</a>{" "}
						or the{" "}
						<a
							href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							className="font-medium text-foreground hover:text-primary"
						>
							Learning
						</a>{" "}
						center.
					</p>
				</div>
				<div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
					<a
						className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-primary-foreground transition-colors hover:opacity-90 md:w-[158px]"
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							className="opacity-90"
							src="/vercel.svg"
							alt="Vercel logomark"
							width={16}
							height={16}
						/>
						Deploy Now
					</a>
					<a
						className="flex h-12 w-full items-center justify-center rounded-full border border-input bg-background px-5 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:w-[158px]"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Documentation
					</a>
				</div>
			</main>
		</div>
	);
}
