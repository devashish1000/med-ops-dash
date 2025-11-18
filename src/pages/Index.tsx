import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Star, MessageSquare, CheckSquare, Calendar, Download, QrCode, Reply, Phone, Plus } from 'lucide-react';
import { generateFeedback, generateKanbanTasks, generateAppointments, generateHistoricalMetrics, providers } from '@/utils/mockData';
import { format } from 'date-fns';

const Dashboard = () => {
  // Generate all data
  const feedbackRecords = useMemo(() => generateFeedback(), []);
  const kanbanTasks = useMemo(() => generateKanbanTasks(), []);
  const appointments = useMemo(() => generateAppointments(), []);
  const metrics = useMemo(() => generateHistoricalMetrics(), []);

  // State
  const [activeView, setActiveView] = useState<"dashboard" | "feedback" | "kanban" | "schedule">("dashboard");
  const [selectedServiceLine, setSelectedServiceLine] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");

  // Computed metrics
  const dashboardStats = useMemo(() => {
    const totalPatients = 1247;
    const revenue = 485000;
    const avgUtilization = 87;
    const patientSatisfaction = Math.round((feedbackRecords.filter(f => f.rating >= 4).length / feedbackRecords.length) * 100);

    return {
      patients: { value: totalPatients, trend: 23, label: "Patient Volume" },
      revenue: { value: `$${(revenue / 1000).toFixed(0)}K`, trend: 18, label: "Monthly Revenue" },
      utilization: { value: `${avgUtilization}%`, trend: 5, label: "Provider Utilization" },
      satisfaction: { value: `${patientSatisfaction}%`, trend: 12, label: "Patient Satisfaction" },
    };
  }, [feedbackRecords]);

  // Feedback stats
  const feedbackStats = useMemo(() => {
    const filtered = selectedServiceLine === "all" 
      ? feedbackRecords 
      : feedbackRecords.filter(f => f.serviceLine === selectedServiceLine);

    const positive = filtered.filter(f => f.sentiment === "positive").length;
    const neutral = filtered.filter(f => f.sentiment === "neutral").length;
    const negative = filtered.filter(f => f.sentiment === "negative").length;
    const avgRating = (filtered.reduce((sum, f) => sum + f.rating, 0) / filtered.length).toFixed(1);
    const needsFollowUp = filtered.filter(f => f.needsFollowUp && f.status !== "Resolved").length;

    return { positive, neutral, negative, avgRating, total: filtered.length, needsFollowUp, data: filtered };
  }, [feedbackRecords, selectedServiceLine]);

  // Kanban stats
  const kanbanStats = useMemo(() => {
    const todo = kanbanTasks.filter(t => t.status === "ToDo").length;
    const inProgress = kanbanTasks.filter(t => t.status === "InProgress").length;
    const review = kanbanTasks.filter(t => t.status === "Review").length;
    const done = kanbanTasks.filter(t => t.status === "Done").length;

    return { todo, inProgress, review, done, total: kanbanTasks.length };
  }, [kanbanTasks]);

  // Service line performance
  const serviceLinePerformance = useMemo(() => {
    return ["Neurology", "Pain Management", "PM&R"].map(service => {
      const serviceFeedback = feedbackRecords.filter(f => f.serviceLine === service);
      const avgRating = serviceFeedback.length > 0 
        ? (serviceFeedback.reduce((sum, f) => sum + f.rating, 0) / serviceFeedback.length).toFixed(1)
        : "0";
      const positive = ((serviceFeedback.filter(f => f.sentiment === "positive").length / serviceFeedback.length) * 100).toFixed(0);

      return {
        name: service,
        avgRating: parseFloat(avgRating),
        satisfaction: parseInt(positive) || 0,
        volume: serviceFeedback.length,
      };
    });
  }, [feedbackRecords]);

  const sentimentData = [
    { name: "Positive", value: feedbackStats.positive, color: "#10b981" },
    { name: "Neutral", value: feedbackStats.neutral, color: "#f59e0b" },
    { name: "Negative", value: feedbackStats.negative, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Medical Practice Director Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time insights and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Last updated: {format(new Date(), 'MMM d, h:mm a')}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mt-4">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "feedback", label: "Feedback", icon: MessageSquare },
              { id: "kanban", label: "Tasks", icon: CheckSquare },
              { id: "schedule", label: "Schedule", icon: Calendar },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeView === tab.id ? "default" : "ghost"}
                onClick={() => setActiveView(tab.id as any)}
                className="gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {/* DASHBOARD VIEW */}
        {activeView === "dashboard" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { ...dashboardStats.patients, icon: Users, color: "text-blue-500" },
                { ...dashboardStats.revenue, icon: DollarSign, color: "text-green-500" },
                { ...dashboardStats.utilization, icon: Clock, color: "text-orange-500" },
                { ...dashboardStats.satisfaction, icon: Star, color: "text-yellow-500" },
              ].map((stat, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium text-success">+{stat.trend}%</span>
                          <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Volume Trend */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Patient Volume Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={metrics.patientVolume}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Trend */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Revenue Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={metrics.revenue}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Service Line Performance */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Service Line Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceLinePerformance.map((service) => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{service.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{service.volume} responses</span>
                          <span className="font-semibold">{service.avgRating} ⭐</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${service.satisfaction}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{service.satisfaction}% positive feedback</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Feedback</p>
                      <p className="text-3xl font-bold mt-1">{feedbackRecords.length}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Tasks</p>
                      <p className="text-3xl font-bold mt-1">{kanbanStats.todo + kanbanStats.inProgress}</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Weekly Appointments</p>
                      <p className="text-3xl font-bold mt-1">{appointments.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* FEEDBACK VIEW */}
        {activeView === "feedback" && (
          <div className="space-y-6">
            {/* Feedback Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Responses</p>
                  <p className="text-2xl font-bold mt-1">{feedbackStats.total}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold mt-1">{feedbackStats.avgRating} ⭐</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border border-success/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Positive</p>
                  <p className="text-2xl font-bold mt-1 text-success">{feedbackStats.positive}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border border-warning/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Neutral</p>
                  <p className="text-2xl font-bold mt-1 text-warning">{feedbackStats.neutral}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border border-destructive/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Negative</p>
                  <p className="text-2xl font-bold mt-1 text-destructive">{feedbackStats.negative}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Select value={selectedServiceLine} onValueChange={setSelectedServiceLine}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Service Lines</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pain Management">Pain Management</SelectItem>
                  <SelectItem value="PM&R">PM&R</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Feedback Collection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-8 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
                        <p className="text-xs text-muted-foreground mt-2">Scan to submit feedback</p>
                      </div>
                      <Input value="https://clinic.example.com/feedback" readOnly />
                      <p className="text-sm text-muted-foreground">Share this link via email or display the QR code in your waiting room</p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export {feedbackStats.data.length} records
                </Button>
              </div>
            </div>

            {/* Sentiment Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-card border-border lg:col-span-1">
                <CardHeader>
                  <CardTitle>Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle>Feedback Trends (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metrics.satisfaction}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Feedback List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Feedback ({feedbackStats.data.length})</CardTitle>
                  {feedbackStats.needsFollowUp > 0 && (
                    <Badge variant="destructive">{feedbackStats.needsFollowUp} Need Follow-up</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackStats.data.slice(0, 20).map((feedback) => (
                    <div key={feedback.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < feedback.rating ? 'fill-warning text-warning' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                            <Badge variant={feedback.sentiment === "positive" ? "default" : feedback.sentiment === "neutral" ? "secondary" : "destructive"}>
                              {feedback.sentiment}
                            </Badge>
                            <Badge variant="outline">{feedback.serviceLine}</Badge>
                            <span className="text-sm text-muted-foreground">{format(feedback.date, 'MMM d, yyyy')}</span>
                          </div>

                          <p className="text-sm">{feedback.comment}</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {feedback.patientName ? (
                              <span>👤 {feedback.patientName}</span>
                            ) : (
                              <span>🕶️ Anonymous</span>
                            )}
                            {feedback.email && <span>📧 {feedback.email}</span>}
                            {feedback.phone && <span>📞 {feedback.phone}</span>}
                          </div>

                          {feedback.status !== "Pending" && (
                            <div className="p-3 bg-muted rounded-lg mt-2">
                              <p className="text-sm font-medium mb-1">Response:</p>
                              <p className="text-sm text-muted-foreground">{feedback.responseText}</p>
                              <p className="text-xs text-muted-foreground mt-1">Responded on {format(feedback.respondedAt!, 'MMM d, yyyy')}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Badge variant={feedback.status === "Resolved" ? "default" : "outline"}>
                            {feedback.status}
                          </Badge>

                          {feedback.needsFollowUp && feedback.status !== "Resolved" && (
                            <Badge variant="destructive" className="text-xs">
                              Follow-up Needed
                            </Badge>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedFeedback(feedback)}>
                                <Reply className="h-3 w-3 mr-1" />
                                Respond
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Respond to Feedback</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-sm font-medium">Original Feedback:</p>
                                  <p className="text-sm text-muted-foreground mt-1">{feedback.comment}</p>
                                  <p className="text-xs text-muted-foreground mt-2">Rating: {feedback.rating}/5 ⭐</p>
                                </div>
                                <Textarea
                                  placeholder="Type your response..."
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  rows={4}
                                />
                                <Button className="w-full">Send Response</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {feedback.needsFollowUp && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedFeedback(feedback)}>
                                  <Phone className="h-3 w-3 mr-1" />
                                  Follow-up
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Patient Follow-up</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium">{feedback.patientName || "Anonymous"}</p>
                                    {feedback.email && <p className="text-sm text-muted-foreground">{feedback.email}</p>}
                                    {feedback.phone && <p className="text-sm text-muted-foreground">{feedback.phone}</p>}
                                  </div>
                                  <Textarea
                                    placeholder="Follow-up notes..."
                                    value={followUpNotes}
                                    onChange={(e) => setFollowUpNotes(e.target.value)}
                                    rows={4}
                                  />
                                  <Button className="w-full">Mark as Contacted</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* KANBAN VIEW */}
        {activeView === "kanban" && (
          <div className="space-y-6">
            {/* Kanban Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold mt-1">{kanbanStats.total}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border border-muted">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">To Do</p>
                  <p className="text-2xl font-bold mt-1">{kanbanStats.todo}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border border-primary/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold mt-1 text-primary">{kanbanStats.inProgress}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border border-warning/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Review</p>
                  <p className="text-2xl font-bold mt-1 text-warning">{kanbanStats.review}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border border-success/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Done</p>
                  <p className="text-2xl font-bold mt-1 text-success">{kanbanStats.done}</p>
                </CardContent>
              </Card>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { status: "ToDo", title: "To Do", tasks: kanbanTasks.filter(t => t.status === "ToDo"), color: "border-muted" },
                { status: "InProgress", title: "In Progress", tasks: kanbanTasks.filter(t => t.status === "InProgress"), color: "border-primary" },
                { status: "Review", title: "Review", tasks: kanbanTasks.filter(t => t.status === "Review"), color: "border-warning" },
                { status: "Done", title: "Done", tasks: kanbanTasks.filter(t => t.status === "Done"), color: "border-success" },
              ].map((column) => (
                <Card key={column.status} className={`bg-card ${column.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{column.title}</CardTitle>
                      <Badge variant="outline">{column.tasks.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                    {column.tasks.slice(0, 10).map((task) => (
                      <div key={task.id} className="p-3 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <p className="font-medium text-sm mb-2">{task.title}</p>
                        <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>👤 {task.owner}</span>
                          <span>📅 {format(task.dueDate, 'MMM d')}</span>
                        </div>

                        {task.linkedFeedbackId && (
                          <Badge variant="outline" className="text-xs mt-2">
                            Linked to Feedback
                          </Badge>
                        )}
                      </div>
                    ))}

                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Task
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {activeView === "schedule" && (
          <div className="space-y-6">
            {/* Schedule Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Provider Schedule</h2>
                <p className="text-sm text-muted-foreground">Week of {format(new Date(), 'MMM d, yyyy')}</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </div>

            {/* Provider Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {providers.map((provider) => {
                const providerAppts = appointments.filter(a => a.providerId === provider.id);
                const completedAppts = providerAppts.filter(a => a.status === "Completed").length;
                const utilization = providerAppts.length > 0 ? Math.round((completedAppts / providerAppts.length) * 100) : 0;

                return (
                  <Card key={provider.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: provider.color }} />
                        <p className="text-sm font-medium">{provider.name.split(' ')[1]}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{provider.specialty}</p>
                      <p className="text-2xl font-bold">{providerAppts.length}</p>
                      <p className="text-xs text-muted-foreground">appointments</p>
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{utilization}% utilization</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Schedule Grid */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Weekly Schedule ({appointments.length} appointments)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.map((provider) => {
                    const providerAppts = appointments.filter(a => a.providerId === provider.id);

                    return (
                      <div key={provider.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: provider.color }} />
                          <p className="font-medium">{provider.name}</p>
                          <Badge variant="outline" className="text-xs">{providerAppts.length} appointments</Badge>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIndex) => {
                            const dayAppts = providerAppts.filter(a => a.date.getDay() === dayIndex);

                            return (
                              <div key={day} className="p-2 border border-border rounded-lg bg-muted/50 min-h-[100px]">
                                <p className="text-xs font-medium mb-2 text-center">{day}</p>
                                <div className="space-y-1">
                                  {dayAppts.slice(0, 3).map((appt) => (
                                    <div
                                      key={appt.id}
                                      className="text-xs p-1 rounded"
                                      style={{ backgroundColor: `${provider.color}20`, borderLeft: `2px solid ${provider.color}` }}
                                    >
                                      <p className="font-medium truncate">{appt.startTime}</p>
                                      <p className="truncate text-muted-foreground">{appt.type}</p>
                                    </div>
                                  ))}
                                  {dayAppts.length > 3 && (
                                    <p className="text-xs text-muted-foreground text-center">+{dayAppts.length - 3} more</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
