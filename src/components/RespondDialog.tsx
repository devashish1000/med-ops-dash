import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FeedbackRecord } from '@/utils/mockData';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RespondDialogProps {
  feedback: FeedbackRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRespond: (feedbackId: string, response: string) => void;
}

export function RespondDialog({ feedback, open, onOpenChange, onRespond }: RespondDialogProps) {
  const [responseText, setResponseText] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!feedback || !responseText.trim()) return;
    
    onRespond(feedback.id, responseText);
    setResponseText("");
    onOpenChange(false);
    
    toast({
      title: "Response Sent",
      description: "Your response has been sent successfully.",
    });
  };

  if (!feedback) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Respond to Feedback</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">{feedback.patientName || "Anonymous Patient"}</p>
                <p className="text-sm text-muted-foreground">{format(feedback.date, "PPP")}</p>
              </div>
              <Badge variant={
                feedback.sentiment === "positive" ? "default" : 
                feedback.sentiment === "negative" ? "destructive" : 
                "secondary"
              }>
                {feedback.serviceLine}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < feedback.rating ? "fill-warning text-warning" : "text-muted-foreground"
                  )}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({feedback.rating}/5)</span>
            </div>
            
            <p className="text-sm">{feedback.comment}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Response</label>
            <Textarea
              placeholder="Type your response here..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!responseText.trim()}>
            Send Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
