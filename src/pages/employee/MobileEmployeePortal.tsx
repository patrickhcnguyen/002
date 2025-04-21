
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  Menu,
  CalendarSearch,
  FileText,
  Building2,
} from "lucide-react";
import { NotificationsMenu } from "@/components/notifications/NotificationsMenu";

const navigationItems = [
  {
    to: "/mobile-employee",
    icon: <Home className="mr-2 h-5 w-5" />,
    title: "Home"
  },
  {
    to: "/mobile-employee/schedule",
    icon: <Calendar className="mr-2 h-5 w-5" />,
    title: "My Schedule"
  },
  {
    to: "/mobile-employee/open-shifts",
    icon: <CalendarSearch className="mr-2 h-5 w-5" />,
    title: "Open Shifts"
  },
  {
    to: "/mobile-employee/paystubs",
    icon: <FileText className="mr-2 h-5 w-5" />,
    title: "Pay Stubs"
  },
  {
    to: "/mobile-employee/employers",
    icon: <Building2 className="mr-2 h-5 w-5" />,
    title: "My Employers"
  },
  {
    to: "/mobile-employee/messages",
    icon: <MessageSquare className="mr-2 h-5 w-5" />,
    title: "Messages"
  },
];

export default function MobileEmployeePortal() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#F2FCE2] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-black/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <div className="space-y-4">
                  {navigationItems.map((item) => (
                    <Link key={item.to} to={item.to}>
                      <Button variant="ghost" className="w-full justify-start h-auto py-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center ml-4">
            <div className="w-8 h-8 rounded-full bg-black/10 text-foreground flex items-center justify-center mr-2">
              G
            </div>
            <span className="text-foreground text-lg">Hi Grant</span>
          </div>
        </div>

        <NotificationsMenu />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
