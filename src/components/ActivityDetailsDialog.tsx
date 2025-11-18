import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Star, Calendar, MessageSquare } from "lucide-react";
import { FeedbackRecord } from "@/utils/mockData";

interface ActivityDetailsDialogProps {
  feedback: FeedbackRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailsDialog({ feedback, open, onOpenChange }: ActivityDetailsDialogProps) {
  if (!feedback) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Activity Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Patient</span>
              <span className="text-sm">{feedback.patientName || "Anonymous"}</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Service Line</span>
              <Badge variant="outline">{feedback.serviceLine}</Badge>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Date</span>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(feedback.date, "MMM d, yyyy")}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Rating</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < feedback.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sentiment</span>
              <Badge variant={
                feedback.sentiment === "positive" ? "default" : 
                feedback.sentiment === "negative" ? "destructive" : 
                "secondary"
              }>
                {feedback.sentiment}
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="outline">{feedback.status}</Badge>
            </div>
          </div>

          <div>
            <div className="flex items-start gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
              <span className="text-sm font-medium">Comment</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{feedback.comment}</p>
          </div>

          {feedback.email && (
            <div>
              <span className="text-sm font-medium">Contact</span>
              <p className="text-sm text-muted-foreground">{feedback.email}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
