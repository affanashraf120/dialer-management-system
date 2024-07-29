import Link from "next/link";
import React, { useState } from "react";
import { siteConfig } from "../../config/site";
import { cn } from "@lib/utils";
import { ChevronDown, Command, Menu } from "lucide-react";
import UserMenu from "./user-menu.component";
import {
  DropDownMenuArrow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/dropdown";
import dynamic from "next/dynamic";

const AgnecySwitcher = dynamic(() => import("./agency-switcher"), {
  ssr: false,
});

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex w-full items-center justify-between gap-6 md:gap-10">
          <div className="flex items-center gap-6 md:gap-10">
            {/* <Link href="/" className="flex items-center space-x-2">
              <Command />
              <span className="inline-block font-bold">{siteConfig.name}</span>
            </Link> */}
            <AgnecySwitcher />
            {siteConfig.mainNav?.length ? (
              <nav className="md:flex gap-6 hidden">
                {siteConfig.mainNav?.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.href && item.sub ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground flex items-center gap-1 hover:text-primary">
                          {item.title} <ChevronDown className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          {item.sub.map(({ title, href }, idx) => (
                            <DropdownMenuItem
                              asChild
                              key={idx}
                              className="cursor-pointer"
                            >
                              <Link href={item.href + href}>{title}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link
                        key={index}
                        href={"/" + item.href}
                        className={cn(
                          "flex items-center text-sm font-medium text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : null}
          </div>
          <div className="flex items-center gap-6">
            <UserMenu />
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <Menu onClick={toggleMobileMenu} className="cursor-pointer m-4" />
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b">
            <nav className="flex flex-col gap-2 p-4">
              {siteConfig.mainNav?.map((item, index) => (
                <React.Fragment key={index}>
                  {item.href && item.sub ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground flex items-center gap-1 hover:text-primary">
                        {item.title} <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {item.sub.map(({ title, href }, idx) => (
                          <DropdownMenuItem
                            asChild
                            key={idx}
                            className="cursor-pointer"
                            onClick={toggleMobileMenu}
                          >
                            <Link href={item.href + href}>{title}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      key={index}
                      href={"/" + item.href}
                      className={cn(
                        "flex items-center text-sm font-medium text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
