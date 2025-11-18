import { FeedbackRecord, KanbanTask, Appointment } from './mockData';

// Store for runtime data modifications
let feedbackStore: FeedbackRecord[] = [];
let tasksStore: KanbanTask[] = [];
let appointmentsStore: Appointment[] = [];

export function initializeStores(feedback: FeedbackRecord[], tasks: KanbanTask[], appointments: Appointment[]) {
  feedbackStore = [...feedback];
  tasksStore = [...tasks];
  appointmentsStore = [...appointments];
}

export function getFeedbackStore() {
  return feedbackStore;
}

export function getTasksStore() {
  return tasksStore;
}

export function getAppointmentsStore() {
  return appointmentsStore;
}

export function updateFeedback(id: string, updates: Partial<FeedbackRecord>) {
  const index = feedbackStore.findIndex(f => f.id === id);
  if (index !== -1) {
    feedbackStore[index] = { ...feedbackStore[index], ...updates };
  }
  return feedbackStore;
}

export function addAppointment(appointment: Omit<Appointment, 'id'>) {
  const newAppointment = {
    ...appointment,
    id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  appointmentsStore.push(newAppointment);
  return appointmentsStore;
}

export function exportFeedbackToCSV(feedback: FeedbackRecord[]) {
  const headers = ['Date', 'Patient Name', 'Service Line', 'Rating', 'Sentiment', 'Comment', 'Status', 'Response'];
  const rows = feedback.map(f => [
    f.date.toLocaleDateString(),
    f.patientName || 'Anonymous',
    f.serviceLine,
    f.rating.toString(),
    f.sentiment,
    `"${f.comment.replace(/"/g, '""')}"`,
    f.status,
    f.responseText ? `"${f.responseText.replace(/"/g, '""')}"` : ''
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
