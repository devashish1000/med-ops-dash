import { useCallback } from "react";

export interface TourStepEvent {
  stepIndex: number;
  stepTarget: string;
  action: "view" | "skip" | "complete" | "back";
  timestamp: number;
}

export interface TourAnalytics {
  sessionId: string;
  startTime: number;
  endTime?: number;
  completed: boolean;
  events: TourStepEvent[];
}

const ANALYTICS_KEY = "tour-analytics";

export function useTourAnalytics() {
  const startTourSession = useCallback(() => {
    const sessionId = `tour-${Date.now()}`;
    const analytics: TourAnalytics = {
      sessionId,
      startTime: Date.now(),
      completed: false,
      events: [],
    };
    
    const allAnalytics = getAllAnalytics();
    allAnalytics.push(analytics);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(allAnalytics));
    
    return sessionId;
  }, []);

  const trackStepEvent = useCallback((event: TourStepEvent) => {
    const allAnalytics = getAllAnalytics();
    const currentSession = allAnalytics[allAnalytics.length - 1];
    
    if (currentSession) {
      currentSession.events.push(event);
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(allAnalytics));
    }
  }, []);

  const completeTourSession = useCallback(() => {
    const allAnalytics = getAllAnalytics();
    const currentSession = allAnalytics[allAnalytics.length - 1];
    
    if (currentSession) {
      currentSession.completed = true;
      currentSession.endTime = Date.now();
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(allAnalytics));
    }
  }, []);

  const skipTourSession = useCallback(() => {
    const allAnalytics = getAllAnalytics();
    const currentSession = allAnalytics[allAnalytics.length - 1];
    
    if (currentSession) {
      currentSession.completed = false;
      currentSession.endTime = Date.now();
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(allAnalytics));
    }
  }, []);

  const getAnalyticsSummary = useCallback(() => {
    const allAnalytics = getAllAnalytics();
    
    const stepStats: Record<number, { views: number; skips: number; completions: number }> = {};
    let totalSessions = allAnalytics.length;
    let completedSessions = 0;

    allAnalytics.forEach((session) => {
      if (session.completed) completedSessions++;

      session.events.forEach((event) => {
        if (!stepStats[event.stepIndex]) {
          stepStats[event.stepIndex] = { views: 0, skips: 0, completions: 0 };
        }

        if (event.action === "view") stepStats[event.stepIndex].views++;
        if (event.action === "skip") stepStats[event.stepIndex].skips++;
        if (event.action === "complete") stepStats[event.stepIndex].completions++;
      });
    });

    return {
      totalSessions,
      completedSessions,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
      stepStats,
      allAnalytics,
    };
  }, []);

  return {
    startTourSession,
    trackStepEvent,
    completeTourSession,
    skipTourSession,
    getAnalyticsSummary,
  };
}

function getAllAnalytics(): TourAnalytics[] {
  const stored = localStorage.getItem(ANALYTICS_KEY);
  return stored ? JSON.parse(stored) : [];
}
