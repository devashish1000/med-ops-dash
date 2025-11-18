import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, Clock, DollarSign, Heart, CheckCircle2, AlertCircle, Calendar, Info, Download, Users, BarChart3, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizationTour } from "@/components/OptimizationTour";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Cell } from 'recharts';
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  title: string;
  category: "quick-win" | "long-term";
  impact: {
    revenue: number;
    patientSat: number;
    providerSat: number;
  };
  effort: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  description: string;
  steps: string[];
  resources: string[];
  expectedROI: string;
  timeframe: string;
  implementationDate: string;
  benefitRealizationDate: string;
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Optimize Morning Appointment Slots",
    category: "quick-win",
    impact: { revenue: 85, patientSat: 75, providerSat: 60 },
    effort: "low",
    status: "pending",
    description: "Increase morning appointment availability by 20% to match peak patient demand between 8-10 AM",
    steps: [
      "Analyze current morning slot utilization",
      "Identify providers with capacity",
      "Adjust schedule templates",
      "Monitor for 2 weeks"
    ],
    resources: ["Scheduling coordinator (2 hours)", "System configuration (1 hour)"],
    expectedROI: "+$15K monthly revenue, 12% reduction in wait times",
    timeframe: "1-2 weeks",
    implementationDate: "Week of Dec 15, 2025",
    benefitRealizationDate: "Jan 2026"
  },
  {
    id: "2",
    title: "Implement Pre-Visit Text Reminders",
    category: "quick-win",
    impact: { revenue: 70, patientSat: 90, providerSat: 65 },
    effort: "low",
    status: "in-progress",
    description: "Reduce no-show rate by 30% through automated 24-hour text reminders",
    steps: [
      "Enable SMS notification system",
      "Create reminder templates",
      "Set automated trigger rules",
      "Track no-show metrics"
    ],
    resources: ["IT setup (3 hours)", "SMS service subscription ($200/month)"],
    expectedROI: "+$22K monthly revenue from recovered appointments",
    timeframe: "1 week",
    implementationDate: "Week of Dec 8, 2025",
    benefitRealizationDate: "Dec 2025"
  },
  {
    id: "3",
    title: "Expand Telehealth Follow-up Capacity",
    category: "long-term",
    impact: { revenue: 75, patientSat: 85, providerSat: 80 },
    effort: "medium",
    status: "pending",
    description: "Convert 40% of routine follow-ups to telehealth to free up in-person capacity",
    steps: [
      "Identify suitable appointment types for telehealth",
      "Train providers on virtual visit protocols",
      "Update scheduling system with telehealth options",
      "Patient communication campaign",
      "Monitor quality metrics"
    ],
    resources: ["Training program (1 week)", "Marketing materials", "IT support"],
    expectedROI: "+30% capacity utilization, $35K monthly revenue",
    timeframe: "4-6 weeks",
    implementationDate: "Week of Jan 5, 2026",
    benefitRealizationDate: "Mar 2026"
  },
  {
    id: "4",
    title: "Consolidate Lunch Break Scheduling",
    category: "quick-win",
    impact: { revenue: 60, patientSat: 55, providerSat: 45 },
    effort: "medium",
    status: "pending",
    description: "Stagger provider lunch breaks to maintain 80% coverage during 11 AM-2 PM",
    steps: [
      "Survey providers on preferred lunch times",
      "Create staggered break schedule",
      "Implement gradual rollout",
      "Monitor patient wait times"
    ],
    resources: ["Schedule coordinator (5 hours)", "Provider agreement"],
    expectedROI: "+8% midday capacity, $8K monthly revenue",
    timeframe: "2-3 weeks",
    implementationDate: "Week of Dec 22, 2025",
    benefitRealizationDate: "Feb 2026"
  },
  {
    id: "5",
    title: "Launch Multi-Provider Group Visits",
    category: "long-term",
    impact: { revenue: 80, patientSat: 70, providerSat: 75 },
    effort: "high",
    status: "pending",
    description: "Implement group visit model for chronic disease management (diabetes, hypertension)",
    steps: [
      "Develop group visit protocols",
      "Train providers and staff",
      "Create patient education materials",
      "Pilot with one condition",
      "Evaluate and scale"
    ],
    resources: ["Program development (8 weeks)", "Staff training", "Space allocation"],
    expectedROI: "+$45K monthly, 2.5x patient capacity per hour",
    timeframe: "3-4 months",
    implementationDate: "Week of Feb 1, 2026",
    benefitRealizationDate: "Jun 2026"
  },
  {
    id: "6",
    title: "Dynamic Overbooking Based on No-Show Patterns",
    category: "long-term",
    impact: { revenue: 90, patientSat: 50, providerSat: 55 },
    effort: "high",
    status: "pending",
    description: "Implement AI-based overbooking to fill 90% of expected no-show slots",
    steps: [
      "Analyze historical no-show patterns by time/provider",
      "Develop prediction algorithm",
      "Set conservative overbooking rules",
      "Train schedulers on system",
      "Monitor and adjust thresholds"
    ],
    resources: ["Data analysis (2 weeks)", "System integration", "Staff training"],
    expectedROI: "+$40K monthly revenue, 15% capacity gain",
    timeframe: "8-12 weeks",
    implementationDate: "Week of Jan 12, 2026",
    benefitRealizationDate: "Apr 2026"
  }
];

export default function Optimization() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [forecastPeriod, setForecastPeriod] = useState("90");
  const [startTour, setStartTour] = useState(false);

  // Check if tour is in progress when page loads
  useState(() => {
    const tourInProgress = localStorage.getItem("tour-in-progress");
    
    if (tourInProgress === "true") {
      setTimeout(() => {
        setStartTour(true);
        localStorage.removeItem("tour-in-progress");
      }, 500);
    }
  });

  // Parse timeframe to get days
  const parseTimeframeToDays = (timeframe: string): number => {
    const match = timeframe.match(/(\d+)-?(\d+)?/);
    if (!match) return 0;
    
    if (timeframe.includes("week")) {
      const weeks = parseInt(match[2] || match[1]);
      return weeks * 7;
    } else if (timeframe.includes("month")) {
      const months = parseInt(match[2] || match[1]);
      return months * 30;
    }
    return parseInt(match[1]);
  };

  // Filter recommendations based on forecast period
  const { filteredRecommendations, quickWins, longTerm } = useMemo(() => {
    const forecastDays = parseInt(forecastPeriod);
    const filtered = mockRecommendations.filter(rec => {
      const implementationDays = parseTimeframeToDays(rec.timeframe);
      return implementationDays <= forecastDays;
    });
    
    return {
      filteredRecommendations: filtered,
      quickWins: filtered.filter(r => r.category === "quick-win"),
      longTerm: filtered.filter(r => r.category === "long-term")
    };
  }, [forecastPeriod]);

  // Calculate dynamic KPIs based on filtered recommendations
  const dynamicKPIs = useMemo(() => {
    const totalRevenue = filteredRecommendations.reduce((sum, rec) => {
      const revenueMatch = rec.expectedROI.match(/\+?\$(\d+)K/);
      return sum + (revenueMatch ? parseInt(revenueMatch[1]) : 0);
    }, 0);

    const avgPatientSat = filteredRecommendations.length > 0
      ? Math.round(filteredRecommendations.reduce((sum, rec) => sum + rec.impact.patientSat, 0) / filteredRecommendations.length / 5)
      : 0;

    const avgCapacity = filteredRecommendations.length > 0
      ? Math.round(filteredRecommendations.reduce((sum, rec) => sum + rec.impact.providerSat, 0) / filteredRecommendations.length / 3)
      : 0;

    return {
      revenue: totalRevenue,
      patientSat: avgPatientSat,
      capacity: avgCapacity
    };
  }, [filteredRecommendations]);

  // Service line comparison data
  const serviceLineData = useMemo(() => {
    const serviceLines = ["Neurology", "Pain Management", "PM&R", "Orthopedics", "Cardiology", "Primary Care", "Physical Therapy", "Sports Medicine"];
    return serviceLines.map(line => ({
      name: line,
      patientVolume: Math.floor(Math.random() * 500) + 200,
      revenue: Math.floor(Math.random() * 150) + 50,
      satisfaction: (Math.random() * 1 + 4).toFixed(1)
    }));
  }, []);

  // Referral tracking data
  const referralData = useMemo(() => [
    { from: "Primary Care", to: "Cardiology", count: 45 },
    { from: "Primary Care", to: "Orthopedics", count: 38 },
    { from: "Sports Medicine", to: "Orthopedics", count: 32 },
    { from: "Sports Medicine", to: "Physical Therapy", count: 28 },
    { from: "Pain Management", to: "PM&R", count: 25 },
    { from: "Neurology", to: "Pain Management", count: 22 },
    { from: "Cardiology", to: "Physical Therapy", count: 18 },
    { from: "Orthopedics", to: "Physical Therapy", count: 35 }
  ], []);

  // Provider capacity utilization data
  const providerCapacityData = useMemo(() => {
    const providers = [
      "Dr. Sarah Chen", "Dr. Michael Rodriguez", "Dr. Emily Johnson", 
      "Dr. James Williams", "Dr. Lisa Anderson", "Dr. Robert Martinez",
      "Dr. Amanda Foster", "Dr. David Thompson", "Dr. Jennifer Lee", "Dr. Christopher Brown"
    ];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    
    return providers.map(provider => ({
      name: provider,
      ...days.reduce((acc, day) => ({
        ...acc,
        [day]: Math.floor(Math.random() * 40) + 60 // 60-100% utilization
      }), {})
    }));
  }, []);

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress": return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 20;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Optimization Insights', margin, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Forecast Period: ${forecastPeriod} Days`, margin, yPosition);
    pdf.text(`Data Analysis: Oct 1 - Nov 15, 2025`, margin, yPosition + 5);
    
    yPosition += 10;
    
    // KPIs
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Revenue Impact: +$${dynamicKPIs.revenue}K/mo`, margin, yPosition);
    pdf.text(`Patient Satisfaction: +${dynamicKPIs.patientSat}%`, margin + 65, yPosition);
    pdf.text(`Capacity: +${dynamicKPIs.capacity}%`, margin + 130, yPosition);
    
    yPosition += 15;

    // Quick Wins Section
    if (quickWins.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Quick Wins', margin, yPosition);
      yPosition += 8;

      quickWins.forEach((rec, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${rec.title}`, margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        
        // Description
        const descLines = pdf.splitTextToSize(rec.description, pageWidth - 2 * margin);
        pdf.text(descLines, margin + 3, yPosition);
        yPosition += descLines.length * 4 + 2;

        // Timeline info
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Start: ${rec.implementationDate}`, margin + 3, yPosition);
        pdf.text(`ROI Visible: ${rec.benefitRealizationDate}`, margin + 70, yPosition);
        yPosition += 5;

        // Expected ROI
        pdf.text('Expected ROI: ', margin + 3, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(rec.expectedROI, margin + 28, yPosition);
        yPosition += 5;

        // Effort
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Effort: ${rec.effort}`, margin + 3, yPosition);
        yPosition += 8;
      });
    }

    // Long-term Section
    if (longTerm.length > 0) {
      if (yPosition > 240) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 5;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Long-term Improvements', margin, yPosition);
      yPosition += 8;

      longTerm.forEach((rec, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${rec.title}`, margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        
        // Description
        const descLines = pdf.splitTextToSize(rec.description, pageWidth - 2 * margin);
        pdf.text(descLines, margin + 3, yPosition);
        yPosition += descLines.length * 4 + 2;

        // Timeline info
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Start: ${rec.implementationDate}`, margin + 3, yPosition);
        pdf.text(`ROI Visible: ${rec.benefitRealizationDate}`, margin + 70, yPosition);
        yPosition += 5;

        // Expected ROI
        pdf.text('Expected ROI: ', margin + 3, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(rec.expectedROI, margin + 28, yPosition);
        yPosition += 5;

        // Effort
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Effort: ${rec.effort}`, margin + 3, yPosition);
        yPosition += 8;
      });
    }

    pdf.save('optimization-insights.pdf');
    
    toast({
      title: "PDF Exported",
      description: `Successfully exported ${filteredRecommendations.length} recommendations to PDF.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <OptimizationTour run={startTour} onComplete={() => setStartTour(false)} />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Optimization Insights</h1>
              <p className="text-muted-foreground">Actionable recommendations to improve capacity and efficiency</p>
            </div>
          </div>
          <Button onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
        </div>

        {/* Forecast Period & Data Analysis Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Forecast Period</p>
                    <p className="text-xs text-muted-foreground">Recommendations based on next:</p>
                  </div>
                </div>
                <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                  <SelectTrigger className="w-[140px]" data-tour="forecast-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted-foreground/20 bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-5 w-5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">These insights are predictive recommendations for future planning based on historical trends and patterns</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div>
                  <p className="text-sm font-medium">Data Analysis Period</p>
                  <p className="text-xs text-muted-foreground">Based on data from: Oct 1 - Nov 15, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Matrix Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Matrix</CardTitle>
            <CardDescription>Recommendations ranked by impact vs. effort</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-tour="dynamic-kpis">
              <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Revenue Impact</h3>
                  </div>
                  <p className="text-2xl font-bold">+${dynamicKPIs.revenue}K/mo</p>
                  <p className="text-sm text-muted-foreground">Potential monthly increase</p>
                </CardContent>
              </Card>
              <Card className="border-blue-500/50 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Patient Satisfaction</h3>
                  </div>
                  <p className="text-2xl font-bold">+{dynamicKPIs.patientSat}%</p>
                  <p className="text-sm text-muted-foreground">Average improvement</p>
                </CardContent>
              </Card>
              <Card className="border-purple-500/50 bg-purple-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Capacity Utilization</h3>
                  </div>
                  <p className="text-2xl font-bold">+{dynamicKPIs.capacity}%</p>
                  <p className="text-sm text-muted-foreground">Expected increase</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Wins */}
        {quickWins.length > 0 ? (
        <div data-tour="recommendations">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default" className="bg-green-500">Quick Wins</Badge>
            <span className="text-sm text-muted-foreground">High impact, low effort - implement immediately ({quickWins.length} recommendations)</span>
          </div>
          <div className="grid gap-4">
            {quickWins.map((rec) => (
              <Card key={rec.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(rec.status)}
                        <CardTitle className="text-xl">{rec.title}</CardTitle>
                        <Badge variant="outline" className={getEffortColor(rec.effort) + " text-white"}>
                          {rec.effort} effort
                        </Badge>
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Impact Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Revenue
                        </span>
                        <span className="text-sm font-medium">{rec.impact.revenue}%</span>
                      </div>
                      <Progress value={rec.impact.revenue} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          Patient
                        </span>
                        <span className="text-sm font-medium">{rec.impact.patientSat}%</span>
                      </div>
                      <Progress value={rec.impact.patientSat} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          Provider
                        </span>
                        <span className="text-sm font-medium">{rec.impact.providerSat}%</span>
                      </div>
                      <Progress value={rec.impact.providerSat} className="h-2" />
                    </div>
                  </div>

                  {/* Implementation Steps */}
                  <div>
                    <h4 className="font-semibold mb-2">Implementation Steps</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {rec.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Resources & ROI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Resources Needed</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.resources.map((resource, idx) => (
                          <li key={idx}>• {resource}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Expected ROI</h4>
                      <p className="text-sm text-muted-foreground">{rec.expectedROI}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Timeframe</h4>
                      <p className="text-sm text-muted-foreground">{rec.timeframe}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Start Date
                      </h4>
                      <p className="text-sm text-primary font-medium">{rec.implementationDate}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        ROI Visible
                      </h4>
                      <p className="text-sm text-success font-medium">{rec.benefitRealizationDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        ) : (
          <Card className="border-muted">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No quick win recommendations available for the selected {forecastPeriod}-day period.</p>
            </CardContent>
          </Card>
        )}

        {/* Long-term Improvements */}
        {longTerm.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Long-term Improvements</Badge>
            <span className="text-sm text-muted-foreground">Strategic initiatives for sustained growth ({longTerm.length} recommendations)</span>
          </div>
          <div className="grid gap-4">
            {longTerm.map((rec) => (
              <Card key={rec.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(rec.status)}
                        <CardTitle className="text-xl">{rec.title}</CardTitle>
                        <Badge variant="outline" className={getEffortColor(rec.effort) + " text-white"}>
                          {rec.effort} effort
                        </Badge>
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Impact Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Revenue
                        </span>
                        <span className="text-sm font-medium">{rec.impact.revenue}%</span>
                      </div>
                      <Progress value={rec.impact.revenue} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          Patient
                        </span>
                        <span className="text-sm font-medium">{rec.impact.patientSat}%</span>
                      </div>
                      <Progress value={rec.impact.patientSat} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          Provider
                        </span>
                        <span className="text-sm font-medium">{rec.impact.providerSat}%</span>
                      </div>
                      <Progress value={rec.impact.providerSat} className="h-2" />
                    </div>
                  </div>

                  {/* Implementation Steps */}
                  <div>
                    <h4 className="font-semibold mb-2">Implementation Steps</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {rec.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Resources & ROI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Resources Needed</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.resources.map((resource, idx) => (
                          <li key={idx}>• {resource}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Expected ROI</h4>
                      <p className="text-sm text-muted-foreground">{rec.expectedROI}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Timeframe</h4>
                      <p className="text-sm text-muted-foreground">{rec.timeframe}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Start Date
                      </h4>
                      <p className="text-sm text-primary font-medium">{rec.implementationDate}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        ROI Visible
                      </h4>
                      <p className="text-sm text-success font-medium">{rec.benefitRealizationDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        ) : (
          <Card className="border-muted">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No long-term recommendations available for the selected {forecastPeriod}-day period.</p>
            </CardContent>
          </Card>
        )}

        {/* Service Line Comparison */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Service Line Performance Comparison</CardTitle>
            </div>
            <CardDescription>Patient volume, revenue, and satisfaction across all service lines</CardDescription>
          </CardHeader>
          <CardContent data-tour="service-comparison">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-center">Patient Volume</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="patientVolume" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-center">Revenue ($K/month)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-center">Satisfaction Score</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                    <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="satisfaction" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross-Service Referral Tracking */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Cross-Service Line Referral Tracking</CardTitle>
            </div>
            <CardDescription>Patient movement between specialties</CardDescription>
          </CardHeader>
          <CardContent data-tour="referral-tracking">
            <div className="space-y-3">
              {referralData.map((referral, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 flex items-center gap-3">
                    <Badge variant="outline" className="min-w-[140px] justify-center">{referral.from}</Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="outline" className="min-w-[140px] justify-center">{referral.to}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-lg">{referral.count}</span>
                    <span className="text-sm text-muted-foreground">referrals</span>
                  </div>
                  <Progress value={(referral.count / 50) * 100} className="w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Provider Capacity Utilization Heat Map */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Provider Capacity Utilization</CardTitle>
            </div>
            <CardDescription>Weekly capacity utilization heat map by provider</CardDescription>
          </CardHeader>
          <CardContent data-tour="capacity-heatmap">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left font-semibold bg-muted">Provider</th>
                    <th className="border p-2 text-center font-semibold bg-muted">Mon</th>
                    <th className="border p-2 text-center font-semibold bg-muted">Tue</th>
                    <th className="border p-2 text-center font-semibold bg-muted">Wed</th>
                    <th className="border p-2 text-center font-semibold bg-muted">Thu</th>
                    <th className="border p-2 text-center font-semibold bg-muted">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  {providerCapacityData.map((provider, idx) => (
                    <tr key={idx}>
                      <td className="border p-2 font-medium">{provider.name}</td>
                      {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => {
                        const utilization = provider[day];
                        const bgColor = utilization >= 90 ? 'bg-red-500/20' : 
                                       utilization >= 80 ? 'bg-orange-500/20' : 
                                       utilization >= 70 ? 'bg-yellow-500/20' : 'bg-green-500/20';
                        return (
                          <td key={day} className={`border p-2 text-center ${bgColor}`}>
                            <span className="font-semibold">{utilization}%</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/20 border"></div>
                  <span className="text-muted-foreground">60-70% (Optimal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500/20 border"></div>
                  <span className="text-muted-foreground">70-80% (Good)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500/20 border"></div>
                  <span className="text-muted-foreground">80-90% (Busy)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500/20 border"></div>
                  <span className="text-muted-foreground">90-100% (Overbooked)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
