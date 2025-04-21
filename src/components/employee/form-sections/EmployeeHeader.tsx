import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Briefcase, FileText, History, MessageSquare } from "lucide-react";
import { useState } from "react";
import { EmployeeDetailsModal } from "./EmployeeDetailsModals";
import { EmployeeRating } from "./header/EmployeeRating";
import { EmployeeStatus } from "./header/EmployeeStatus";
import { EmployeeActions } from "./header/EmployeeActions";

interface EmployeeHeaderProps {
  displayName: string;
  avatarInitials: string;
  initialData?: any;
  setShowAdminDialog: (show: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

export function EmployeeHeader({ 
  displayName, 
  avatarInitials,
  initialData,
  setShowAdminDialog,
  setShowDeleteDialog
}: EmployeeHeaderProps) {
  const [activeModal, setActiveModal] = useState<'pay-rates' | 'jobs' | 'documents' | 'recent-actions' | 'comments' | null>(null);
  
  const actionButtons = [
    {
      type: 'pay-rates' as const,
      label: 'Pay Rates'
    },
    {
      type: 'jobs' as const,
      label: 'Jobs'
    },
    {
      type: 'documents' as const,
      label: 'Documents'
    },
    {
      type: 'recent-actions' as const,
      label: 'Recent Actions'
    },
    {
      type: 'comments' as const,
      label: 'Comments'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>
              {avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {displayName}
            </h2>
            {initialData && (
              <>
                <EmployeeRating rating={initialData.rating || 0} />
                <EmployeeStatus 
                  pushNotificationsEnabled={initialData.push_notifications_enabled}
                  lastActivity={initialData.last_activity}
                  createdAt={initialData.created_at}
                />
              </>
            )}
          </div>
        </div>
        
        {initialData && (
          <EmployeeActions 
            setShowAdminDialog={setShowAdminDialog}
            setShowDeleteDialog={setShowDeleteDialog}
          />
        )}
      </div>

      {initialData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {actionButtons.map(({ type, label }) => (
                <Button
                  key={type}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    setActiveModal(type);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeModal && initialData && (
        <EmployeeDetailsModal
          type={activeModal}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          employeeId={initialData.id}
        />
      )}
    </div>
  );
}