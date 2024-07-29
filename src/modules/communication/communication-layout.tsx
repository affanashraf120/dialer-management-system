import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/resizeable";
import { TooltipProvider } from "@components/tooltip";
import { cn } from "@lib/utils";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import CommunicationSidebar from "./communication-sidebar";

const defaultLayout = [375, 1065];
const navCollapsedSize = 2;

const CommunicationLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`;
          }}
          className="!h-[calc(100vh-65px)] items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={15}
            maxSize={20}
            onExpand={() => {
              setIsCollapsed((prev) => !prev);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                isCollapsed
              )}`;
            }}
            onCollapse={() => {
              setIsCollapsed((prev) => !prev);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                isCollapsed
              )}`;
            }}
            className={cn(
              isCollapsed &&
                "min-w-[50px] transition-all duration-300 ease-in-out",
              "max-w-[240px]"
            )}
          >
            <CommunicationSidebar
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "SMS",
                  label: "",
                  icon: MessageCircle,
                  variant: "ghost",
                  path: "sms",
                },
                {
                  title: "Email",
                  label: "",
                  icon: Mail,
                  variant: "ghost",
                  path: "email",
                },
                {
                  title: "Call",
                  label: "",
                  icon: Phone,
                  variant: "ghost",
                  path: "call",
                },
              ]}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <div className="p-4 flex flex-col gap-4">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </>
  );
};

export default CommunicationLayout;
