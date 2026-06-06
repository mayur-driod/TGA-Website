import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/8bit/button";
import ForestRunnerGame from "@/components/ui/8bit/forest-runner-game";

interface NotFound1Props {
  className?: string;
  cta?: string;
  description?: string;
  href?: string;
  title?: string;
}

export default function NotFound1({
  title = "The forest went off-map!",
  description = "This room doesn't exist. Plant your way home.",
  cta = "Return to Home Page",
  href = "/",
  className,
}: NotFound1Props) {
  return (
    <div
      className={cn(
        "retro grid w-full place-content-center bg-background px-4 py-16 text-center md:py-24",
        className,
      )}
    >
      <div className="retro font-bold text-6xl tracking-tight sm:text-8xl leading-none">
        404
      </div>

      <div className="mt-4 flex justify-center">
        <ForestRunnerGame />
      </div>

      <h1 className="retro font-bold text-2xl tracking-tight sm:text-4xl mt-2">
        {title}
      </h1>

      <p className="retro text-muted-foreground text-xs mt-3">{description}</p>

      <div className="flex justify-center mt-6">
        <Button asChild>
          <a href={href}>{cta}</a>
        </Button>
      </div>
    </div>
  );
}