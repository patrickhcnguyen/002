import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquare,
  Clock,
  FileText,
  Settings,
  UserPlus,
  Smartphone
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LogoDisplay } from "@/components/LogoDisplay";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AppSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/employees", icon: Users, label: "Employees" },
    { path: "/schedule", icon: CalendarDays, label: "Schedule" },
    { path: "/communication", icon: MessageSquare, label: "Communication" },
    { path: "/timesheet", icon: Clock, label: "Timesheet" },
    { path: "/invoicing", icon: FileText, label: "Invoicing" },
    { path: "/recruit", icon: UserPlus, label: "Recruit" },
    { path: "/mobile-employee", icon: Smartphone, label: "Mobile View", className: "text-accent" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Sidebar>
      <div className="flex items-center justify-center px-2 py-4">
        <LogoDisplay className="w-8 h-8" />
      </div>
      <SidebarContent>
        <TooltipProvider delayDuration={0}>
          <SidebarMenu>
            {menuItems.map(({ path, icon: Icon, label, className }) => (
              <SidebarMenuItem key={path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={path} className="w-full flex justify-center">
                      <SidebarMenuButton 
                        variant="default"
                        isActive={location.pathname === path}
                        className={`w-8 h-8 p-0 flex items-center justify-center ${
                          location.pathname === path 
                            ? "bg-accent/20 text-accent hover:bg-accent/30" 
                            : "hover:bg-accent/10"
                        } ${className || ''}`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                        <span className="sr-only">{label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {label}
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-4 border-t border-border">
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}