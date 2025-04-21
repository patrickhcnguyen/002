import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Rss, Workflow, UserMinus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventHeaderProps {
  title: string;
  activeTab: 'schedule' | 'timesheet' | 'feed' | 'workflows' | 'unbooked';
  onTabChange: (tab: 'schedule' | 'timesheet' | 'feed' | 'workflows' | 'unbooked') => void;
}

export function EventHeader({ title, activeTab, onTabChange }: EventHeaderProps) {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        <p className="text-sm text-muted-foreground">Event details and management</p>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as typeof activeTab)} className="w-full">
        <TabsList className="w-full justify-start bg-accent/10">
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="timesheet" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timesheet
          </TabsTrigger>
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Rss className="h-4 w-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="unbooked" className="flex items-center gap-2">
            <UserMinus className="h-4 w-4" />
            Unbooked
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}