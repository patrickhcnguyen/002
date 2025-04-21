import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, DollarSign, FileText, History, MessageSquare } from "lucide-react";
import { PayRatesContent } from "./modals/PayRatesContent";
import { JobsContent } from "./modals/JobsContent";
import { DocumentsContent } from "./modals/DocumentsContent";
import { RecentActionsContent } from "./modals/RecentActionsContent";
import { CommentsContent } from "./modals/CommentsContent";

interface EmployeeDetailsModalProps {
  type: 'pay-rates' | 'jobs' | 'documents' | 'recent-actions' | 'comments';
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
}

export function EmployeeDetailsModal({ type, isOpen, onClose, employeeId }: EmployeeDetailsModalProps) {
  const titles = {
    'pay-rates': 'Pay Rates History',
    'jobs': 'Job History',
    'documents': 'Documents',
    'recent-actions': 'Recent Actions',
    'comments': 'Comments'
  };

  const icons = {
    'pay-rates': <DollarSign className="h-4 w-4" />,
    'jobs': <Briefcase className="h-4 w-4" />,
    'documents': <FileText className="h-4 w-4" />,
    'recent-actions': <History className="h-4 w-4" />,
    'comments': <MessageSquare className="h-4 w-4" />
  };

  const renderContent = () => {
    switch (type) {
      case 'pay-rates':
        return <PayRatesContent employeeId={employeeId} />;
      case 'jobs':
        return <JobsContent employeeId={employeeId} />;
      case 'documents':
        return <DocumentsContent employeeId={employeeId} />;
      case 'recent-actions':
        return <RecentActionsContent employeeId={employeeId} />;
      case 'comments':
        return <CommentsContent employeeId={employeeId} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icons[type]}
            {titles[type]}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="p-4">
            {renderContent()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}