import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from "react-joyride";

interface OptimizationTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export function OptimizationTour({ run = false, onComplete }: OptimizationTourProps) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    if (run) {
      setTimeout(() => setRunTour(true), 800);
    }
  }, [run]);

  const steps: Step[] = [
    {
      target: "body",
      content: "Welcome to the Optimization page! Let's explore the AI-powered recommendations...",
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
    const { status, action } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRunTour(false);
      localStorage.removeItem("tour-in-progress");
      onComplete?.();
    }

    // If user clicks back on first step, go back to dashboard
    if (action === ACTIONS.PREV && data.index === 0) {
      localStorage.setItem("tour-return-to-schedule", "true");
      window.location.href = "/dashboard";
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
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
