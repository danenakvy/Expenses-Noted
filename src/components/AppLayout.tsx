import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ReceiptText,
  PanelLeft,
  Mountain,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
];
const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="flex flex-col h-full">
    <div className={cn("flex items-center gap-2 px-4 py-6 border-b border-slate-800", isCollapsed ? "justify-center" : "")}>
      <Mountain className="h-8 w-8 text-primary flex-shrink-0" />
      <h1 className={cn("text-2xl font-bold font-display text-white transition-all duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto")}>
        Apex Ledger
      </h1>
    </div>
    <nav className="flex-1 px-2 py-4 space-y-1">
      <TooltipProvider delayDuration={0}>
        {navItems.map((item) => (
          isCollapsed ? (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-center h-10 w-10 rounded-lg text-slate-300 transition-colors hover:text-white hover:bg-slate-800",
                      isActive && "bg-primary text-white hover:bg-primary/90"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-white hover:bg-slate-800",
                  isActive && "bg-primary text-white hover:bg-primary/90"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        ))}
      </TooltipProvider>
    </nav>
  </div>
);
export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="h-screen w-full bg-slate-950 text-white overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={20}
          minSize={isCollapsed ? 5 : 15}
          maxSize={25}
          collapsible
          collapsedSize={5}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className={cn("hidden md:block transition-all duration-300 ease-in-out", isCollapsed ? "min-w-[72px]" : "min-w-[220px]")}
        >
          <div className="relative h-full bg-slate-900 border-r border-slate-800">
            <SidebarContent isCollapsed={isCollapsed} />
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              size="icon"
              variant="outline"
              className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={80}>
          <div className="flex flex-col h-full">
            <header className="flex h-14 items-center gap-4 border-b border-slate-800 bg-slate-900 px-4 lg:h-[60px] lg:px-6 flex-shrink-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden bg-slate-800 border-slate-700 hover:bg-slate-700"
                  >
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col bg-slate-900 border-slate-800 p-0 w-[280px]">
                  <SidebarContent isCollapsed={false} />
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1">
                {/* Header content can go here */}
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8 overflow-auto">
              <Outlet />
              <footer className="text-center text-sm text-slate-500 mt-auto pt-4">
                Built with ❤️ at Cloudflare
              </footer>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster richColors theme="dark" />
    </div>
  );
}