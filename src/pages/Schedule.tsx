import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  startOfWeek,
  endOfWeek,
  format,
  parseISO
} from "date-fns";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { ScheduleContainer } from "@/components/schedule/ScheduleContainer";
import { useSession } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";

interface Staff {
  date: string;
  position: string;
  startTime: string;
  endTime: string;
  count: number;
  rate: number;
  hours: number;
  subtotal: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  eventType: string;
  startTime: string;
  endTime: string;
  staffing: Staff[];
  shifts: {
    position: string;
    startTime: string;
    endTime: string;
    quantity: number;
    assignedEmployees: string[];
    availableEmployees: string[];
  }[];
  attachments: {
    id: string;
    name: string;
    url: string;
  }[];
}

export default function Schedule() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"Month" | "Week" | "Day">("Month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminBranch, setAdminBranch] = useState<string>('');
  const session = useSession();

  const fetchEvents = async () => {
    if (!session?.user?.email) return;
    
    try {
      setIsLoading(true);
      
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (adminError) {
        console.error('Error fetching admin data:', adminError);
        return;
      }

      const branch = adminData?.branch || session.user.user_metadata?.branch;

      if (!branch) {
        console.error('No branch found for admin');
        return;
      }

      setAdminBranch(branch);

      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('id, request_id, branch, client_name, company_name, event_location, staff_requirements_with_rates, status')
        .eq('status', 'paid')
        .eq('branch', branch);

      if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
        return;
      }

      if (!invoicesData?.length) {
        setIsLoading(false);
        return;
      }

      const requestIds = invoicesData.map(invoice => invoice.request_id);
      
      const { data: requestsData, error: requestsError } = await supabase
        .from('Requests')
        .select('id, type_of_event, event_date, event_location')
        .in('id', requestIds);

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
        return;
      }

      const requestsMap = {};
      requestsData?.forEach((request) => {
        requestsMap[request.id] = request;
      });

      const calendarEvents = invoicesData.map((invoice) => {
        const request = requestsMap[invoice.request_id];
        if (!request) return null;

        const staffRequirements = invoice.staff_requirements_with_rates || [];
        
        const shifts = staffRequirements.map(staff => ({
          position: staff.position,
          startTime: staff.startTime,
          endTime: staff.endTime,
          quantity: staff.count,
          assignedEmployees: [],
          availableEmployees: []
        }));

        const startTime = staffRequirements[0]?.startTime || '00:00';
        const endTime = staffRequirements[0]?.endTime || '23:59';

        return {
          id: invoice.id,
          title: `${request.type_of_event} - ${invoice.company_name || invoice.client_name}`,
          date: parseISO(`${request.event_date}T12:00:00`),
          location: invoice.event_location || request.event_location,
          eventType: request.type_of_event,
          startTime,
          endTime,
          staffing: staffRequirements,
          shifts,
          attachments: [] 
        };
      }).filter(Boolean);

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error in fetchEvents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [session?.user?.email]);

  const handlePreviousMonth = () => setDate(subMonths(date, 1));
  const handleNextMonth = () => setDate(addMonths(date, 1));
  const handleTodayClick = () => setDate(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date)),
    end: endOfWeek(endOfMonth(date))
  });

  const isCurrentMonth = (day: Date) => format(day, 'M') === format(date, 'M');

  const handleEventCreate = () => {};
  const handleEventDelete = () => {};
  const handleEventUpdate = () => {};

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="flex-1 p-6">
        <div className="h-full flex flex-col bg-background">
          <ScheduleHeader
            date={date}
            view={view}
            onViewChange={setView}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onTodayClick={handleTodayClick}
            selectedBranch={[adminBranch]}
            onBranchChange={() => {}} 
          />

          <ScheduleContainer
            view={view}
            date={date}
            days={days}
            events={events}
            isCurrentMonth={isCurrentMonth}
            onEventCreate={handleEventCreate}
            onEventDelete={handleEventDelete}
            onEventUpdate={handleEventUpdate}
          />
        </div>
      </div>
    </div>
  );
}