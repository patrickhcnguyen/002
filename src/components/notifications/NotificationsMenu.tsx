
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Notification {
  id: string;
  status: string;
  notification_type: string;
  created_at: string;
  read_at: string | null;
  event: {
    title: string;
    date: string;
  } | null;
  shift: {
    position: string;
    start_time: string;
    end_time: string;
  } | null;
}

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: notifications, error } = await supabase
        .from('shift_notifications')
        .select(`
          *,
          event:events(title, date),
          shift:shifts(position, start_time, end_time)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(notifications || []);
      setUnreadCount(notifications?.filter(n => n.status === 'unread').length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('shift_notifications')
        .update({
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, status: 'read', read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const renderNotification = (notification: Notification) => {
    if (!notification.event || !notification.shift) return null;

    return (
      <div
        key={notification.id}
        className={`p-4 border-b last:border-b-0 ${
          notification.status === 'unread' ? 'bg-primary/5' : ''
        }`}
        onClick={() => markAsRead(notification.id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{notification.event.title}</p>
            <p className="text-sm text-muted-foreground">
              Position: {notification.shift.position}
            </p>
            <p className="text-sm text-muted-foreground">
              Time: {notification.shift.start_time} - {notification.shift.end_time}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          {notification.status === 'unread' && (
            <Badge variant="default" className="mt-1">New</Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map(renderNotification)
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
