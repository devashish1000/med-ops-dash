import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, Clock, DollarSign, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    timeframe: "1-2 weeks"
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
    timeframe: "1 week"
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
    timeframe: "4-6 weeks"
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
    timeframe: "2-3 weeks"
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
    timeframe: "3-4 months"
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
    timeframe: "8-12 weeks"
  }
];

export default function Optimization() {
  const navigate = useNavigate();

  const quickWins = mockRecommendations.filter(r => r.category === "quick-win");
  const longTerm = mockRecommendations.filter(r => r.category === "long-term");

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

  return (
    <div className="min-h-screen bg-background p-6">
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
        </div>

        {/* Priority Matrix Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Matrix</CardTitle>
            <CardDescription>Recommendations ranked by impact vs. effort</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Revenue Impact</h3>
                  </div>
                  <p className="text-2xl font-bold">+$165K/mo</p>
                  <p className="text-sm text-muted-foreground">Potential monthly increase</p>
                </CardContent>
              </Card>
              <Card className="border-blue-500/50 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Patient Satisfaction</h3>
                  </div>
                  <p className="text-2xl font-bold">+18%</p>
                  <p className="text-sm text-muted-foreground">Average improvement</p>
                </CardContent>
              </Card>
              <Card className="border-purple-500/50 bg-purple-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Capacity Utilization</h3>
                  </div>
                  <p className="text-2xl font-bold">+25%</p>
                  <p className="text-sm text-muted-foreground">Expected increase</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Wins */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default" className="bg-green-500">Quick Wins</Badge>
            <span className="text-sm text-muted-foreground">High impact, low effort - implement immediately</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Long-term Improvements */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Long-term Improvements</Badge>
            <span className="text-sm text-muted-foreground">Strategic initiatives for sustained growth</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
