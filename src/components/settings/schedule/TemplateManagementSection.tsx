import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Paperclip, X, FileText, Image, File } from "lucide-react";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Attachment } from "@/components/schedule/event-details/types";
import { Card } from "@/components/ui/card";

interface EventSettings {
  id: string;
  user_id: string;
  shift_notes: string;
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}

export function TemplateManagementSection() {
  const session = useSession();
  const queryClient = useQueryClient();
  const [shiftNotes, setShiftNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['eventSettings'],
    queryFn: async () => {
      console.log('Fetching event settings...');
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .eq('user_id', session?.user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching event settings:', error);
        toast.error("Failed to load settings");
        return null;
      }
      
      if (data) {
        const convertedData: EventSettings = {
          ...data,
          attachments: Array.isArray(data.attachments) 
            ? (data.attachments as any[]).map(att => ({
                id: att.id || crypto.randomUUID(),
                name: att.name,
                url: att.url
              }))
            : []
        };
        console.log('Event settings fetched:', convertedData);
        return convertedData;
      }
      
      return null;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (settings) {
      console.log('Setting shift notes from settings:', settings.shift_notes);
      setShiftNotes(settings.shift_notes || "");
      setAttachments(settings.attachments || []);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const attachmentsForDb = attachments.map(att => ({
        id: att.id,
        name: att.name,
        url: att.url
      }));

      const settingsData = {
        user_id: session.user.id,
        shift_notes: shiftNotes,
        attachments: attachmentsForDb,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating settings with data:', settingsData);

      const { data, error } = await supabase
        .from('event_settings')
        .upsert(settingsData, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
      
      console.log('Settings updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventSettings'] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("Please sign in to save settings");
      return;
    }
    await updateSettingsMutation.mutateAsync();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const newAttachments: Attachment[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5000000) {
          toast.error(`File ${file.name} is too large. Please upload files under 5MB.`);
          continue;
        }

        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = (e) => {
            const newAttachment: Attachment = {
              id: crypto.randomUUID(),
              name: file.name,
              url: e.target?.result as string
            };
            newAttachments.push(newAttachment);
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      }

      setAttachments(prev => [...prev, ...newAttachments]);
      if (newAttachments.length > 0) {
        toast.success("Files attached successfully");
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return <Image className="w-6 h-6" />;
    }
    return <File className="w-6 h-6" />;
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    toast.success("Attachment removed");
  };

  if (isLoadingSettings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Event Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure default settings for new events.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="shiftNotes">Default Shift Notes</Label>
          <Textarea
            id="shiftNotes"
            value={shiftNotes}
            onChange={(e) => setShiftNotes(e.target.value)}
            placeholder="Enter default shift notes"
            className="h-32"
          />
        </div>

        <div className="space-y-2">
          <Label>Default Attachments</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((attachment) => (
              <Card 
                key={attachment.id} 
                className="p-4 relative group"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="flex flex-col items-center gap-2">
                  {attachment.url.startsWith('data:image') ? (
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-muted rounded-md">
                      {getFileIcon(attachment.name)}
                    </div>
                  )}
                  <span className="text-sm truncate w-full text-center">
                    {attachment.name}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
              multiple
            />
            <label htmlFor="file-upload">
              <Button 
                variant="outline" 
                className="w-full cursor-pointer" 
                disabled={isUploading}
                asChild
              >
                <span>
                  <Paperclip className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Add Default Attachments"}
                </span>
              </Button>
            </label>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={updateSettingsMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}