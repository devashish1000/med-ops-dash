import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Star, MessageSquare, CheckSquare, Calendar, Download, Flag, Reply, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateFeedback, generateKanbanTasks, generateAppointments, generateHistoricalMetrics, providers, FeedbackRecord, KanbanTask, Appointment } from '@/utils/mockData';
import { updateFeedback, addAppointment as addAppointmentToStore, exportFeedbackToCSV, initializeStores } from '@/utils/mockDataHelpers';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { RespondDialog } from '@/components/RespondDialog';
import { TaskDetailsDialog } from '@/components/TaskDetailsDialog';
import { AddAppointmentDialog } from '@/components/AddAppointmentDialog';
import { ProviderDetailsDialog } from '@/components/ProviderDetailsDialog';
import { ActivityDetailsDialog } from '@/components/ActivityDetailsDialog';
import { UserProfile } from '@/components/UserProfile';
import { OnboardingTour } from '@/components/OnboardingTour';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [startTour, setStartTour] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("userEmail");
    const firstTimeUser = localStorage.getItem("firstTimeUser");
    
    if (isLoggedIn === "true" && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setIsCheckingAuth(false);
      
      // Start tour for first-time users only
      if (firstTimeUser === "true") {
        setTimeout(() => setStartTour(true), 1000);
        localStorage.removeItem("firstTimeUser"); // Clear flag after showing
      }
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  // Generate initial data
  const initialFeedback = useMemo(() => generateFeedback(), []);
  const initialTasks = useMemo(() => generateKanbanTasks(), []);
  const initialAppointments = useMemo(() => generateAppointments(), []);
  const metricsData = useMemo(() => generateHistoricalMetrics(), []);
  const metrics = metricsData.satisfaction;

  // State
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>(initialFeedback);
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(initialTasks);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [activeView, setActiveView] = useState<"dashboard" | "feedback" | "kanban" | "schedule">("dashboard");
  const [selectedServiceLine, setSelectedServiceLine] = useState<string>("all");
  
  // Date filter state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Dialog states
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [addAppointmentDialogOpen, setAddAppointmentDialogOpen] = useState(false);
  const [providerDialogOpen, setProviderDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<FeedbackRecord | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Kanban column pagination state
  const [kanbanPageToDo, setKanbanPageToDo] = useState(1);
  const [kanbanPageInProgress, setKanbanPageInProgress] = useState(1);
  const [kanbanPageReview, setKanbanPageReview] = useState(1);
  const [kanbanPageDone, setKanbanPageDone] = useState(1);
  const kanbanItemsPerPage = 10;

  // Kanban filter state
  const [kanbanStatusFilter, setKanbanStatusFilter] = useState<string | null>(null);

  // Initialize stores
  useEffect(() => {
    initializeStores(feedbackRecords, kanbanTasks, appointments);
  }, []);

  // Filter data by date range
  const filterByDateRange = <T extends { date: Date }>(data: T[]): T[] => {
    if (!startDate || !endDate) return data;
    return data.filter(item => 
      isWithinInterval(startOfDay(item.date), {
        start: startOfDay(startDate),
        end: endOfDay(endDate)
      })
    );
  };

  // Filtered data
  const filteredFeedback = useMemo(() => {
    let filtered = filterByDateRange(feedbackRecords);
    if (selectedServiceLine !== "all") {
      filtered = filtered.filter(f => f.serviceLine === selectedServiceLine);
    }
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [feedbackRecords, selectedServiceLine, startDate, endDate]);

  const filteredTasks = useMemo(() => {
    return filterByDateRange(kanbanTasks.map(t => ({ ...t, date: t.createdAt })));
  }, [kanbanTasks, startDate, endDate]);

  const filteredAppointments = useMemo(() => {
    return filterByDateRange(appointments);
  }, [appointments, startDate, endDate]);

  // Pagination
  const paginatedFeedback = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFeedback.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFeedback, currentPage]);

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedServiceLine, startDate, endDate]);

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    const totalPatients = 1247;
    const revenue = 485000;
    const avgUtilization = 87;
    const patientSatisfaction = Math.round((filteredFeedback.filter(f => f.rating >= 4).length / filteredFeedback.length) * 100) || 0;

    return {
      patients: { value: totalPatients, trend: 23, label: "Patient Volume" },
      revenue: { value: `$${(revenue / 1000).toFixed(0)}K`, trend: 18, label: "Monthly Revenue" },
      utilization: { value: `${avgUtilization}%`, trend: 5, label: "Provider Utilization" },
      satisfaction: { value: `${patientSatisfaction}%`, trend: 12, label: "Patient Satisfaction" },
    };
  }, [filteredFeedback]);

  // Feedback stats
  const feedbackStats = useMemo(() => {
    const positive = filteredFeedback.filter(f => f.sentiment === "positive").length;
    const neutral = filteredFeedback.filter(f => f.sentiment === "neutral").length;
    const negative = filteredFeedback.filter(f => f.sentiment === "negative").length;
    const avgRating = filteredFeedback.length > 0 
      ? (filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / filteredFeedback.length).toFixed(1)
      : "0";
    const needsFollowUp = filteredFeedback.filter(f => f.needsFollowUp && f.status !== "Resolved").length;

    return { positive, neutral, negative, avgRating, total: filteredFeedback.length, needsFollowUp };
  }, [filteredFeedback]);

  // Kanban stats
  const kanbanStats = useMemo(() => {
    const todo = filteredTasks.filter(t => t.status === "ToDo").length;
    const inProgress = filteredTasks.filter(t => t.status === "InProgress").length;
    const review = filteredTasks.filter(t => t.status === "Review").length;
    const done = filteredTasks.filter(t => t.status === "Done").length;

    return { todo, inProgress, review, done, total: filteredTasks.length };
  }, [filteredTasks]);

  // Service line performance
  const serviceLinePerformance = useMemo(() => {
    const serviceLines = ["Neurology", "Pain Management", "PM&R", "Orthopedics", "Cardiology", "Primary Care", "Physical Therapy", "Sports Medicine"];
    return serviceLines.map(service => {
      const serviceFeedback = filteredFeedback.filter(f => f.serviceLine === service);
      const avgRating = serviceFeedback.length > 0 
        ? (serviceFeedback.reduce((sum, f) => sum + f.rating, 0) / serviceFeedback.length).toFixed(1)
        : "0";
      const positive = serviceFeedback.length > 0
        ? ((serviceFeedback.filter(f => f.sentiment === "positive").length / serviceFeedback.length) * 100).toFixed(0)
        : "0";

      return {
        name: service,
        avgRating: parseFloat(avgRating),
        positivePercent: parseFloat(positive),
        target: 4.5, // Target rating for all service lines
      };
    });
  }, [filteredFeedback]);

  // Handlers
  const handleRespondToFeedback = (feedbackId: string, response: string) => {
    const updated = updateFeedback(feedbackId, {
      responseText: response,
      respondedAt: new Date(),
      status: "Responded"
    });
    setFeedbackRecords([...updated]);
  };

  const handleToggleFollowUp = (feedbackId: string) => {
    const feedback = feedbackRecords.find(f => f.id === feedbackId);
    if (!feedback) return;

    const updated = updateFeedback(feedbackId, {
      needsFollowUp: !feedback.needsFollowUp
    });
    setFeedbackRecords([...updated]);

    toast({
      title: feedback.needsFollowUp ? "Removed from Follow-up" : "Added to Follow-up",
      description: feedback.needsFollowUp 
        ? "This feedback has been removed from your follow-up queue."
        : "This feedback has been added to your follow-up queue.",
    });
  };

  const handleExportFeedback = () => {
    exportFeedbackToCSV(filteredFeedback);
    toast({
      title: "Export Successful",
      description: `Exported ${filteredFeedback.length} feedback records to CSV.`,
    });
  };

  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const updated = addAppointmentToStore(appointment);
    setAppointments([...updated]);
  };

  const handleTaskCardClick = (task: KanbanTask) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleProviderCardClick = (provider: any) => {
    setSelectedProvider(provider);
    setProviderDialogOpen(true);
  };

  const handleKanbanStatusClick = (status: string) => {
    setKanbanStatusFilter(kanbanStatusFilter === status ? null : status);
  };

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    sonnerToast.success("Signed out successfully");
    navigate("/auth");
  };

  const handleRestartTour = () => {
    setStartTour(true);
    setActiveView("dashboard"); // Start from dashboard
    sonnerToast.success("Tour restarted! Follow the highlights.");
  };

  const handleTourNavigate = (view: string) => {
    setActiveView(view as any);
  };

  const handleActivityCardClick = (feedback: FeedbackRecord) => {
    setSelectedActivity(feedback);
    setActivityDialogOpen(true);
  };

  // Filtered kanban tasks by status
  const displayedTasks = useMemo(() => {
    if (!kanbanStatusFilter) return filteredTasks;
    return filteredTasks.filter(t => t.status === kanbanStatusFilter);
  }, [filteredTasks, kanbanStatusFilter]);

  // Colors
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  // Render functions
  const renderStatCard = (icon: any, stat: any) => (
    <Card variant="glass-strong" className="hover:scale-[1.02] transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold gradient-text">{stat.value}</p>
            <div className="flex items-center gap-1 text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">+{stat.trend}%</span>
            </div>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  const renderDashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-tour="kpi-cards">
        {renderStatCard(<Users className="h-8 w-8 text-primary" />, dashboardStats.patients)}
        {renderStatCard(<DollarSign className="h-8 w-8 text-success" />, dashboardStats.revenue)}
        {renderStatCard(<Clock className="h-8 w-8 text-warning" />, dashboardStats.utilization)}
        {renderStatCard(<Star className="h-8 w-8 text-warning" />, dashboardStats.satisfaction)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" className="animate-fade-in">
          <CardHeader>
            <CardTitle>Patient Satisfaction Trend</CardTitle>
          </CardHeader>
          <CardContent data-tour="satisfaction-chart">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Current"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
                <Line 
                  type="monotone" 
                  dataKey="previousYear" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Previous Year"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="glass" className="animate-fade-in">
          <CardHeader>
            <CardTitle>Service Line Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={serviceLinePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="avgRating" fill="hsl(var(--primary))" name="Current Rating" />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass" className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFeedback.slice(0, 5).map((feedback, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted hover:scale-[1.02] transition-all duration-200"
                onClick={() => handleActivityCardClick(feedback)}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{feedback.patientName || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">{feedback.serviceLine} - {format(feedback.date, "MMM d, yyyy")}</p>
                  </div>
                </div>
                <Badge variant={
                  feedback.sentiment === "positive" ? "default" : 
                  feedback.sentiment === "negative" ? "destructive" : 
                  "secondary"
                }>
                  {feedback.sentiment}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFeedbackView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedServiceLine} onValueChange={setSelectedServiceLine}>
            <SelectTrigger className="w-[200px]" data-tour="service-line-filter">
              <SelectValue placeholder="All Service Lines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Service Lines</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="Pain Management">Pain Management</SelectItem>
              <SelectItem value="PM&R">PM&R</SelectItem>
              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Primary Care">Primary Care</SelectItem>
              <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
              <SelectItem value="Sports Medicine">Sports Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExportFeedback}>
          <Download className="mr-2 h-4 w-4" />
          Export Records
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" data-tour="feedback-stats">
        <Card variant="glass-strong" className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text">{feedbackStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Feedback</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass-strong" className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{feedbackStats.positive}</p>
              <p className="text-sm text-muted-foreground">Positive</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass-strong" className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{feedbackStats.neutral}</p>
              <p className="text-sm text-muted-foreground">Neutral</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass-strong" className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{feedbackStats.negative}</p>
              <p className="text-sm text-muted-foreground">Negative</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass-strong" className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text">{feedbackStats.avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent data-tour="feedback-section">
          <div className="space-y-3">
            {paginatedFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{feedback.patientName || "Anonymous Patient"}</p>
                      <Badge variant="outline">{feedback.serviceLine}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{format(feedback.date, "PPP")}</p>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.rating ? "fill-warning text-warning" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm">{feedback.comment}</p>
                  </div>
                  <Badge variant={
                    feedback.sentiment === "positive" ? "default" : 
                    feedback.sentiment === "negative" ? "destructive" : 
                    "secondary"
                  }>
                    {feedback.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setRespondDialogOpen(true);
                    }}
                  >
                    <Reply className="mr-1 h-3 w-3" />
                    Respond
                  </Button>
                  <Button 
                    size="sm" 
                    variant={feedback.needsFollowUp ? "default" : "outline"}
                    onClick={() => handleToggleFollowUp(feedback.id)}
                  >
                    <Flag className="mr-1 h-3 w-3" />
                    Follow
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Page: {currentPage}
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderKanbanView = () => {
    const columns = [
      { status: "ToDo", title: "To Do", count: kanbanStats.todo, color: "secondary" },
      { status: "InProgress", title: "In Progress", count: kanbanStats.inProgress, color: "default" },
      { status: "Review", title: "Review", count: kanbanStats.review, color: "warning" },
      { status: "Done", title: "Done", count: kanbanStats.done, color: "success" }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-tour="kanban-stats">
          {columns.map(col => (
            <Card 
              key={col.status} 
              variant="glass-strong"
              className={`cursor-pointer transition-all duration-300 ${
                kanbanStatusFilter === col.status 
                  ? 'ring-2 ring-primary shadow-[0_0_30px_hsl(195_100%_55%/0.4)]' 
                  : kanbanStatusFilter && kanbanStatusFilter !== col.status
                  ? 'opacity-40'
                  : 'hover:scale-[1.02]'
              }`}
              onClick={() => handleKanbanStatusClick(col.status)}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{col.count}</p>
                  <p className="text-sm text-muted-foreground">{col.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {kanbanStatusFilter && (
          <Button variant="outline" onClick={() => setKanbanStatusFilter(null)}>
            Clear Filter
          </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-tour="kanban-board">
          {columns.map(col => {
            const tasks = displayedTasks.filter(t => t.status === col.status);
            const isVisible = !kanbanStatusFilter || kanbanStatusFilter === col.status;
            
            // Get pagination state for this column
            let currentKanbanPage = 1;
            let setCurrentKanbanPage = setKanbanPageToDo;
            
            if (col.status === "ToDo") {
              currentKanbanPage = kanbanPageToDo;
              setCurrentKanbanPage = setKanbanPageToDo;
            } else if (col.status === "InProgress") {
              currentKanbanPage = kanbanPageInProgress;
              setCurrentKanbanPage = setKanbanPageInProgress;
            } else if (col.status === "Review") {
              currentKanbanPage = kanbanPageReview;
              setCurrentKanbanPage = setKanbanPageReview;
            } else if (col.status === "Done") {
              currentKanbanPage = kanbanPageDone;
              setCurrentKanbanPage = setKanbanPageDone;
            }
            
            // Paginate tasks for this column
            const totalKanbanPages = Math.ceil(tasks.length / kanbanItemsPerPage);
            const startIdx = (currentKanbanPage - 1) * kanbanItemsPerPage;
            const endIdx = startIdx + kanbanItemsPerPage;
            const paginatedTasks = tasks.slice(startIdx, endIdx);
            
            return (
              <div 
                key={col.status} 
                className={`transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0 hidden'}`}
              >
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-sm">{col.title} ({tasks.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {paginatedTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border-2 border-primary/20 bg-muted/50 cursor-pointer hover:bg-muted hover:border-primary/40 transition-all"
                        onClick={() => handleTaskCardClick(task)}
                      >
                        <p className="text-sm font-medium mb-2">{task.title}</p>
                        <p className="text-xs text-muted-foreground mb-2">{task.owner}</p>
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {/* Pagination controls */}
                    {totalKanbanPages > 1 && (
                      <div className="pt-3 mt-3 border-t border-border">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentKanbanPage(Math.max(1, currentKanbanPage - 1))}
                            disabled={currentKanbanPage === 1}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            List: {currentKanbanPage}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentKanbanPage(Math.min(totalKanbanPages, currentKanbanPage + 1))}
                            disabled={currentKanbanPage === totalKanbanPages}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScheduleView = () => {
    const providerStats = providers.map(provider => {
      const providerAppointments = filteredAppointments.filter(a => a.providerId === provider.id);
      const totalHoursPerWeek = 40;
      const bookedHours = providerAppointments.length * 0.75;
      const utilization = Math.round((bookedHours / totalHoursPerWeek) * 100);

      return {
        ...provider,
        appointments: providerAppointments.length,
        utilization
      };
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setAddAppointmentDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providerStats.map(provider => (
            <Card 
              key={provider.id}
              variant="glass"
              className="cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_25px_hsl(195_100%_55%/0.3)] transition-all duration-300"
              onClick={() => handleProviderCardClick(provider)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={provider.image} alt={provider.name} />
                      <AvatarFallback 
                        className="text-white font-bold"
                        style={{ backgroundColor: provider.color }}
                      >
                        {provider.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{provider.name}</p>
                      <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold">{provider.appointments}</p>
                      <p className="text-xs text-muted-foreground">Appointments</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold">{provider.utilization}%</p>
                      <p className="text-xs text-muted-foreground">Utilization</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredAppointments
                .filter(a => a.status === "Scheduled")
                .slice(0, 10)
                .map(apt => {
                  const provider = providers.find(p => p.id === apt.providerId);
                  return (
                    <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{apt.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {provider?.name} - {format(apt.date, "MMM d, yyyy")} at {apt.startTime}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{apt.type}</Badge>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <OnboardingTour 
        run={startTour} 
        onNavigate={handleTourNavigate}
        currentView={activeView}
        onComplete={() => setStartTour(false)}
      />
      {isCheckingAuth ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Med OpsX
            </h1>
            <p className="text-muted-foreground">Real-time insights and analytics</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm text-muted-foreground">Welcome {userEmail}!</p>
            <UserProfile email={userEmail} onSignOut={handleSignOut} onRestartTour={handleRestartTour} />
          </div>
        </div>

        {/* Navigation & Date Filter */}
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex gap-2" data-tour="nav-tabs">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "feedback", label: "Feedback", icon: MessageSquare },
              { id: "kanban", label: "Tasks", icon: CheckSquare },
            ].map(nav => (
              <Button
                key={nav.id}
                variant={activeView === nav.id ? "default" : "outline"}
                onClick={() => setActiveView(nav.id as any)}
              >
                <nav.icon className="mr-2 h-4 w-4" />
                {nav.label}
              </Button>
            ))}
          </div>

          {/* Date Filter - inline */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Date Range:</span>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            {(startDate || endDate) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeView === "schedule" ? "default" : "outline"}
              onClick={() => setActiveView("schedule")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/optimization"}
              data-tour="optimization-link"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Optimization
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeView === "dashboard" && renderDashboardView()}
        {activeView === "feedback" && renderFeedbackView()}
        {activeView === "kanban" && renderKanbanView()}
        {activeView === "schedule" && renderScheduleView()}
      </div>
    </div>
      )}

      {/* Dialogs */}
      <RespondDialog
        feedback={selectedFeedback}
        open={respondDialogOpen}
        onOpenChange={setRespondDialogOpen}
        onRespond={handleRespondToFeedback}
      />

      <TaskDetailsDialog
        task={selectedTask}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
      />

      <AddAppointmentDialog
        open={addAppointmentDialogOpen}
        onOpenChange={setAddAppointmentDialogOpen}
        onAdd={handleAddAppointment}
      />

      <ProviderDetailsDialog
        provider={selectedProvider}
        appointments={filteredAppointments}
        open={providerDialogOpen}
        onOpenChange={setProviderDialogOpen}
      />

      <ActivityDetailsDialog
        feedback={selectedActivity}
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
      />
    </>
  );
};

export default Dashboard;
