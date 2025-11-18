import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Provider, Appointment } from '@/utils/mockData';
import { format } from 'date-fns';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface ProviderDetailsDialogProps {
  provider: Provider | null;
  appointments: Appointment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProviderDetailsDialog({ provider, appointments, open, onOpenChange }: ProviderDetailsDialogProps) {
  if (!provider) return null;

  const providerAppointments = appointments.filter(a => a.providerId === provider.id);
  const totalHoursPerWeek = 40; // 8 hours per day, 5 days
  const bookedHours = providerAppointments.length * 0.75; // Average 45 mins per appointment
  const utilization = Math.round((bookedHours / totalHoursPerWeek) * 100);

  const upcomingAppointments = providerAppointments
    .filter(a => a.status === "Scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{provider.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Badge style={{ backgroundColor: provider.color }} className="mb-2">
              {provider.specialty}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Appointments</span>
              </div>
              <p className="text-2xl font-bold">{providerAppointments.length}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Booked Hours</span>
              </div>
              <p className="text-2xl font-bold">{bookedHours.toFixed(1)}h</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Utilization</span>
              </div>
              <p className="text-2xl font-bold">{utilization}%</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Utilization Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Hours (Weekly)</span>
                <span className="font-medium">{totalHoursPerWeek}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booked Hours</span>
                <span className="font-medium">{bookedHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Hours</span>
                <span className="font-medium">{(totalHoursPerWeek - bookedHours).toFixed(1)}h</span>
              </div>
              <Progress value={utilization} className="h-2" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Upcoming Appointments</h4>
            <div className="space-y-2">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{apt.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{format(apt.date, "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">{apt.startTime}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Average appointment duration: 45 minutes
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
