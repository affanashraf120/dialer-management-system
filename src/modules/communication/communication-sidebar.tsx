import { buttonVariants } from "@components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/tooltip";
import { cn } from "@lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface CommunicationSidebar {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    path: string;
  }[];
}

export default function CommunicationSidebar({
  links,
  isCollapsed,
}: CommunicationSidebar) {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/communication/${link.path}`}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    pathname == `/communication/${link.path}` &&
                      "text-accent-foreground bg-accent",
                    "h-9 w-9"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={`/communication/${link.path}`}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                pathname == `/communication/${link.path}` &&
                  "text-accent-foreground bg-accent",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span className={cn("ml-auto")}>{link.label}</span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
