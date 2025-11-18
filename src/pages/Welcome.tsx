import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, MessageSquare, CheckSquare, Calendar, TrendingUp, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import chiHealthLogo from "@/assets/chi-health-logo.png";

const Welcome = () => {
  const [activeTab, setActiveTab] = useState<"analytics" | "feedback" | "tasks" | "schedule">("analytics");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden w-full">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 max-w-full">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Animated CHI Health Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
              <img 
                src={chiHealthLogo} 
                alt="CHI Health" 
                className="relative h-24 w-auto object-contain animate-scale-in"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </div>
          
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            Built for Medical Directors
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Data-Driven Healthcare Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your practice with real-time analytics, patient feedback, and intelligent task management—all in one unified platform.
          </p>
          
          {/* Animated Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Patient Feedbacks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Tasks Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Appointments</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8">
                View Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Everything You Need to Manage Your Practice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track KPIs, patient volume, revenue, and utilization in one comprehensive view
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Patient Feedback System</h3>
              <p className="text-muted-foreground">
                Capture, respond, and act on patient sentiment instantly with trend analysis
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Task Management</h3>
              <p className="text-muted-foreground">
                Turn insights into actions with integrated Kanban board and workflow tracking
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Schedule Optimization</h3>
              <p className="text-muted-foreground">
                Maximize provider utilization and reduce wait times with smart scheduling
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Preview */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">See It in Action</h2>
          <p className="text-muted-foreground">Explore the platform's powerful features</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "analytics", label: "Analytics", icon: TrendingUp },
            { id: "feedback", label: "Feedback", icon: MessageSquare },
            { id: "tasks", label: "Tasks", icon: CheckSquare },
            { id: "schedule", label: "Schedule", icon: Clock },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className="gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Preview Card */}
        <Card className="max-w-4xl mx-auto border-2">
          <CardContent className="p-8">
            {activeTab === "analytics" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Real-Time Dashboard</h3>
                <p className="text-muted-foreground">
                  Monitor patient volume, revenue, provider utilization, and operational efficiency across all service lines.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-success">↑ 23%</div>
                    <div className="text-sm text-muted-foreground">Patient Volume</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-success">↑ 18%</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">87%</div>
                    <div className="text-sm text-muted-foreground">Utilization</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Patient Feedback Intelligence</h3>
                <p className="text-muted-foreground">
                  Analyze sentiment trends, respond to concerns, and track follow-ups across all service lines.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-success">85%</div>
                    <div className="text-sm text-muted-foreground">Positive Sentiment</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">250</div>
                    <div className="text-sm text-muted-foreground">Responses This Month</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Intelligent Task Management</h3>
                <p className="text-muted-foreground">
                  Convert feedback into actionable tasks, track improvements, and measure impact on operations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">100</div>
                    <div className="text-sm text-muted-foreground">Active Tasks</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-success">82%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Smart Scheduling</h3>
                <p className="text-muted-foreground">
                  Optimize provider schedules, track utilization, and reduce patient wait times with data-driven insights.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">150+</div>
                    <div className="text-sm text-muted-foreground">Weekly Appointments</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-success">78%</div>
                    <div className="text-sm text-muted-foreground">Avg Utilization</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trust Indicators */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-full">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">50% Faster</div>
              <div className="text-muted-foreground">Reporting Time</div>
            </div>
            <div>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">30% Better</div>
              <div className="text-muted-foreground">Patient Satisfaction Tracking</div>
            </div>
            <div>
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">5 Minutes</div>
              <div className="text-muted-foreground">To Get Started</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Lines */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-full">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">Comprehensive Service Line Support</h3>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              Neurology
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              Pain Management
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              PM&R
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              Orthopedics
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              Cardiology
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              Primary Care
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              Physical Therapy
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full text-primary font-medium text-sm sm:text-base">
              Sports Medicine
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-full">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Start Managing Smarter Today</h2>
            <p className="text-lg text-muted-foreground">
              Join healthcare leaders who are transforming their practice operations with data-driven insights
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-12">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
