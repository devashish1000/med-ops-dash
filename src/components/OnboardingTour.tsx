import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export function OnboardingTour({ run = false, onComplete }: OnboardingTourProps) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Check if tour has been completed
    const tourCompleted = localStorage.getItem("onboarding-tour-completed");
    
    if (!tourCompleted && run) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => setRunTour(true), 500);
    }
  }, [run]);

  const steps: Step[] = [
    {
      target: "body",
      content: "Welcome to CHI Health Optimization Dashboard! Let's take a quick tour of the key features.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="nav-dashboard"]',
      content: "Access your main dashboard here to view key metrics and insights.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="nav-optimization"]',
      content: "Visit the Optimization page to analyze performance and get AI-powered recommendations.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="service-lines"]',
      content: "These are your 8 service lines. Each card shows real-time metrics and status.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="quick-actions"]',
      content: "Quick actions to view analytics, schedule appointments, and access feedback.",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem("onboarding-tour-completed", "true");
      onComplete?.();
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
