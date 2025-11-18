import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS, ACTIONS, EVENTS } from "react-joyride";

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
  onNavigate?: (view: string) => void;
  currentView?: string;
  currentPage?: string;
}

export function OnboardingTour({ run = false, onComplete, onNavigate, currentView, currentPage }: OnboardingTourProps) {
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (run) {
      setStepIndex(0);
      setTimeout(() => setRunTour(true), 500);
    }
  }, [run]);

  // All tour steps across all pages
  const allSteps: Step[] = [
    // Dashboard Page Steps
    {
      target: "body",
      content: "Welcome to CHI Health Operations Dashboard! Let's take a comprehensive tour through all the features. This will guide you through every page.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="kpi-cards"]',
      content: "These KPI cards show your most important metrics: Patient Volume, Revenue, Provider Utilization, and Patient Satisfaction with trend indicators.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="satisfaction-chart"]',
      content: "This chart tracks patient satisfaction trends over time, comparing actual performance against target goals.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="volume-chart"]',
      content: "Monitor patient volume trends across different service lines to identify growth opportunities.",
      disableBeacon: true,
    },
    
    // Feedback View Steps
    {
      target: "body",
      content: "Now let's explore the Patient Feedback system...",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="service-line-filter"]',
      content: "Filter feedback by service line to focus on specific departments like Neurology, Cardiology, or Primary Care.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="feedback-stats"]',
      content: "View feedback statistics including total count, positive/neutral/negative sentiment breakdown, and average rating.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="feedback-section"]',
      content: "Review individual patient feedback with ratings, sentiment analysis, and quick actions to respond or flag items.",
      disableBeacon: true,
    },
    
    // Tasks/Kanban View Steps
    {
      target: "body",
      content: "Next, let's look at the Task Management system...",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="kanban-stats"]',
      content: "Track task progress with counts for To Do, In Progress, Review, and Done categories.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="kanban-board"]',
      content: "Organize and manage tasks using this Kanban board. Click on any task to view details, assignments, and due dates.",
      disableBeacon: true,
    },
    
    // Schedule View Steps
    {
      target: "body",
      content: "Now let's explore the Schedule Management features...",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="provider-cards"]',
      content: "View provider utilization and appointment statistics. Click any provider card to see detailed schedules and booking information.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="add-appointment"]',
      content: "Click here to schedule new appointments with patient details, provider selection, and time slots.",
      disableBeacon: true,
    },
    
    // Optimization Page Steps
    {
      target: "body",
      content: "Finally, let's explore the Optimization page with AI-powered recommendations...",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="forecast-period"]',
      content: "Select different forecast periods (30, 60, or 90 days) to see how recommendations impact your metrics.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="dynamic-kpis"]',
      content: "These dynamic KPIs update based on selected recommendations showing potential revenue impact, satisfaction improvement, and capacity utilization.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="recommendations"]',
      content: "Review AI-generated recommendations categorized as Quick Wins or Long-term strategies, each with detailed implementation steps and ROI projections.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="service-comparison"]',
      content: "Compare performance metrics across all 8 service lines including patient volume, revenue, and satisfaction scores.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="referral-tracking"]',
      content: "Track cross-service line referral patterns to understand patient journeys across specialties.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="capacity-heatmap"]',
      content: "This heatmap shows provider capacity utilization across the week, helping identify scheduling optimization opportunities.",
      disableBeacon: true,
    },
    {
      target: "body",
      content: "🎉 Tour complete! You're now ready to use the full CHI Health Operations Dashboard. Click your profile icon anytime to restart this tour.",
      placement: "center",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRunTour(false);
      setStepIndex(0);
      onComplete?.();
      return;
    }

    if (type === EVENTS.STEP_AFTER) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      
      // Navigate to Optimization page when reaching that step
      if (nextStepIndex === 14 && action === ACTIONS.NEXT) {
        localStorage.setItem("tour-in-progress", "true");
        window.location.href = "/optimization";
        return;
      } else if (nextStepIndex === 4 && action === ACTIONS.NEXT) {
        // Moving to Feedback view
        onNavigate?.("feedback");
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else if (nextStepIndex === 8 && action === ACTIONS.NEXT) {
        // Moving to Tasks view
        onNavigate?.("kanban");
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else if (nextStepIndex === 11 && action === ACTIONS.NEXT) {
        // Moving to Schedule view
        onNavigate?.("schedule");
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else if (action === ACTIONS.PREV && nextStepIndex === 13) {
        // Going back to Schedule from Optimization transition
        onNavigate?.("schedule");
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else if (action === ACTIONS.PREV && nextStepIndex === 10) {
        // Going back to Kanban from Schedule transition
        onNavigate?.("kanban");
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else if (action === ACTIONS.PREV && nextStepIndex === 7) {
        // Going back to Feedback from Kanban transition
        onNavigate?.("feedback");
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else if (action === ACTIONS.PREV && nextStepIndex === 3) {
        // Going back to Dashboard from Feedback transition
        onNavigate?.("dashboard");
        setTimeout(() => setStepIndex(nextStepIndex), 300);
      } else {
        setStepIndex(nextStepIndex);
      }
    }
  };

  return (
    <Joyride
      steps={allSteps}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          zIndex: 10000,
        },
        spotlight: {
          backgroundColor: "transparent",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
        tooltip: {
          borderRadius: "8px",
          padding: "20px",
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          borderRadius: "6px",
          padding: "8px 16px",
        },
        buttonBack: {
          color: "hsl(var(--foreground))",
          marginRight: "8px",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip Tour",
      }}
    />
  );
}
