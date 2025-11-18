import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS, ACTIONS, EVENTS, TooltipRenderProps } from "react-joyride";
import { useTourAnalytics } from "@/hooks/useTourAnalytics";

interface OptimizationTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: TooltipRenderProps) => {
  return (
    <div
      {...tooltipProps}
      style={{
        backgroundColor: "hsl(var(--card))",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ marginBottom: "12px", fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
        Page 5 of 5: Optimization
      </div>
      <div style={{ marginBottom: "16px", color: "hsl(var(--foreground))" }}>
        {step.content}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button {...skipProps} style={{ color: "hsl(var(--muted-foreground))", background: "none", border: "none", cursor: "pointer" }}>
          {skipProps.title}
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          {index > 0 && (
            <button
              {...backProps}
              style={{
                color: "hsl(var(--foreground))",
                background: "none",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {backProps.title}
            </button>
          )}
          {continuous && (
            <button
              {...primaryProps}
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {primaryProps.title}
            </button>
          )}
          {!continuous && (
            <button
              {...closeProps}
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {closeProps.title}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export function OptimizationTour({ run = false, onComplete }: OptimizationTourProps) {
  const [runTour, setRunTour] = useState(false);
  const { trackStepEvent, completeTourSession, skipTourSession } = useTourAnalytics();

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
    const { status, action, index, type } = data;

    // Track step events (offset by 14 since this is continuation from dashboard tour)
    const step = steps[index];
    const stepTarget = typeof step.target === "string" ? step.target : "body";
    const adjustedIndex = index + 14; // Offset for optimization page steps

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      trackStepEvent({
        stepIndex: adjustedIndex,
        stepTarget,
        action: action === ACTIONS.NEXT ? "complete" : action === ACTIONS.PREV ? "back" : "view",
        timestamp: Date.now(),
      });
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      if (status === STATUS.FINISHED) {
        completeTourSession();
      } else {
        skipTourSession();
        trackStepEvent({
          stepIndex: adjustedIndex,
          stepTarget,
          action: "skip",
          timestamp: Date.now(),
        });
      }
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
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          zIndex: 10000,
        },
        spotlight: {
          backgroundColor: "transparent",
          border: "3px solid hsl(var(--primary))",
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 30px 10px hsl(var(--primary) / 0.6), 0 0 60px 20px hsl(var(--primary) / 0.4), inset 0 0 30px 5px hsl(var(--primary) / 0.3)",
          animation: "pulse-glow 2s ease-in-out infinite",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
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
