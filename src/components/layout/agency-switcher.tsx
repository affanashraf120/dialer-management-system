import { Popover, PopoverContent, PopoverTrigger } from "@components/popover";
import { useAppContext } from "@lib/context/app-context";
import { useState } from "react";
import { Button } from "..";
import { cn } from "@lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { siteConfig } from "../../config/site";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandItem, CommandList } from "@components/command";

const AgnecySwitcher = () => {
  const { selectedAgency, onSelectAgency } = useAppContext();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between")}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedAgency.value}.png`}
                alt={selectedAgency.label}
                // className="grayscale"
              />
              <AvatarFallback>
                {selectedAgency.label.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {selectedAgency.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              {Object.entries(siteConfig.agencies).map(([key, agency]) => (
                <CommandItem
                  key={key}
                  onSelect={() => {
                    onSelectAgency(agency);
                    setOpen(false);
                    window.location.replace("/");
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${agency.value}.png`}
                      alt={agency.label}
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {agency.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedAgency.value === agency.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AgnecySwitcher;
