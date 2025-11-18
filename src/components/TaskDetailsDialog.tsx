import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { KanbanTask } from '@/utils/mockData';
import { format } from 'date-fns';
import { Calendar, User, Tag } from 'lucide-react';

interface TaskDetailsDialogProps {
  task: KanbanTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  if (!task) return null;

  const statusColor = {
    ToDo: "secondary",
    InProgress: "default",
    Review: "warning",
    Done: "success"
  }[task.status] as "secondary" | "default" | "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Badge variant={statusColor} className="mb-3">
              {task.status.replace(/([A-Z])/g, ' $1').trim()}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Description</h4>
              <p className="text-sm">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Owner:</span>
                  <span>{task.owner}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Due:</span>
                  <span>{format(task.dueDate, "PPP")}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Created on {format(task.createdAt, "PPP")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
