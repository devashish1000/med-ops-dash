import { addDays, subDays, subMonths, format } from "date-fns";

// Types
export interface FeedbackRecord {
  id: string;
  date: Date;
  patientName: string | null;
  serviceLine: "Neurology" | "Pain Management" | "PM&R";
  rating: 1 | 2 | 3 | 4 | 5;
  sentiment: "positive" | "neutral" | "negative";
  comment: string;
  isAnonymous: boolean;
  email?: string;
  phone?: string;
  responseText?: string;
  respondedAt?: Date;
  status: "Pending" | "Responded" | "Resolved";
  needsFollowUp: boolean;
  followUpNotes?: string;
  followUpCompletedAt?: Date;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: "ToDo" | "InProgress" | "Review" | "Done";
  owner: string;
  dueDate: Date;
  tags: string[];
  createdAt: Date;
  linkedFeedbackId?: string;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  date: Date;
  startTime: string;
  endTime: string;
  patientName: string;
  type: "New Patient" | "Follow-up" | "Procedure" | "Consultation";
  serviceLine: "Neurology" | "Pain Management" | "PM&R";
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show";
}

export interface Provider {
  id: string;
  name: string;
  specialty: "Neurology" | "Pain Management" | "PM&R";
  color: string;
}

// Providers
export const providers: Provider[] = [
  { id: "p1", name: "Dr. Sarah Chen", specialty: "Neurology", color: "#10b981" },
  { id: "p2", name: "Dr. Michael Rodriguez", specialty: "Pain Management", color: "#f59e0b" },
  { id: "p3", name: "Dr. Emily Johnson", specialty: "PM&R", color: "#8b5cf6" },
  { id: "p4", name: "Dr. James Williams", specialty: "Neurology", color: "#3b82f6" },
  { id: "p5", name: "Dr. Lisa Anderson", specialty: "Pain Management", color: "#ec4899" },
];

// Comments templates
const positiveComments = [
  "Dr. was very thorough and took time to answer all my questions.",
  "Excellent care! Staff was friendly and professional.",
  "Very satisfied with my treatment plan and follow-up care.",
  "The doctor explained everything clearly. I feel confident about my treatment.",
  "Great experience from check-in to check-out. Highly recommend!",
  "Doctor listened carefully and addressed all my concerns.",
  "Professional staff and clean facility. Very impressed.",
  "Best medical experience I've had. Dr. is knowledgeable and caring.",
];

const neutralComments = [
  "Overall okay experience. Wait time was a bit long.",
  "Treatment was fine, but scheduling was difficult.",
  "Doctor was good, but front desk could be more helpful.",
  "Decent visit, nothing exceptional but no complaints.",
  "Average experience. Expected more personalized care.",
  "Professional service but felt rushed during appointment.",
];

const negativeComments = [
  "Waited over an hour past my appointment time. Very frustrating.",
  "Doctor seemed rushed and didn't answer my questions thoroughly.",
  "Front desk staff was unprofessional and rude.",
  "Disappointed with the lack of follow-up after my procedure.",
  "Billing issues and poor communication from office staff.",
  "Felt like just another number. Not enough time with provider.",
  "Scheduling errors and long wait times. Need better organization.",
];

const firstNames = ["John", "Sarah", "Michael", "Emily", "David", "Jessica", "James", "Lisa", "Robert", "Maria", "William", "Jennifer", "Richard", "Linda", "Thomas", "Patricia", "Charles", "Nancy", "Daniel", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

// Generate Feedback
export function generateFeedback(): FeedbackRecord[] {
  const feedback: FeedbackRecord[] = [];
  const now = new Date();

  for (let i = 0; i < 250; i++) {
    const daysAgo = Math.floor(Math.random() * 180); // Last 6 months
    const date = subDays(now, daysAgo);
    
    // Rating distribution: more 4-5, some 1-2
    const rand = Math.random();
    let rating: 1 | 2 | 3 | 4 | 5;
    if (rand < 0.35) rating = 5;
    else if (rand < 0.60) rating = 4;
    else if (rand < 0.75) rating = 3;
    else if (rand < 0.88) rating = 2;
    else rating = 1;

    const sentiment: "positive" | "neutral" | "negative" = 
      rating >= 4 ? "positive" : rating === 3 ? "neutral" : "negative";

    const isAnonymous = Math.random() < 0.3; // 30% anonymous
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const patientName = isAnonymous ? null : `${firstName} ${lastName}`;

    const serviceLines: ("Neurology" | "Pain Management" | "PM&R")[] = ["Neurology", "Pain Management", "PM&R"];
    const serviceLine = serviceLines[Math.floor(Math.random() * serviceLines.length)];

    let comment = "";
    if (sentiment === "positive") {
      comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
    } else if (sentiment === "neutral") {
      comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
    } else {
      comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
    }

    const needsFollowUp = sentiment === "negative" && Math.random() < 0.6;
    const hasResponded = Math.random() < 0.4;
    
    let status: "Pending" | "Responded" | "Resolved" = "Pending";
    if (hasResponded) {
      status = Math.random() < 0.5 ? "Responded" : "Resolved";
    }

    const record: FeedbackRecord = {
      id: `fb-${i + 1}`,
      date,
      patientName,
      serviceLine,
      rating,
      sentiment,
      comment,
      isAnonymous,
      email: !isAnonymous ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com` : undefined,
      phone: !isAnonymous && Math.random() < 0.6 ? `(555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
      responseText: hasResponded ? "Thank you for your feedback. We have reviewed your concerns and are taking steps to improve." : undefined,
      respondedAt: hasResponded ? addDays(date, Math.floor(Math.random() * 3 + 1)) : undefined,
      status,
      needsFollowUp,
      followUpNotes: needsFollowUp && status === "Resolved" ? "Patient contacted and issue resolved" : undefined,
      followUpCompletedAt: needsFollowUp && status === "Resolved" ? addDays(date, Math.floor(Math.random() * 5 + 2)) : undefined,
    };

    feedback.push(record);
  }

  return feedback.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Generate Kanban Tasks
export function generateKanbanTasks(): KanbanTask[] {
  const tasks: KanbanTask[] = [];
  const now = new Date();

  const taskTemplates = [
    { title: "Reduce patient wait times in Neurology", desc: "Analyze scheduling patterns and implement optimization strategies", tags: ["efficiency", "neurology", "scheduling"] },
    { title: "Improve billing communication process", desc: "Revamp billing notifications and add clearer explanations", tags: ["satisfaction", "efficiency"] },
    { title: "Enhance front desk training program", desc: "Develop comprehensive customer service training for reception staff", tags: ["satisfaction", "training"] },
    { title: "Implement post-procedure follow-up system", desc: "Create automated follow-up schedule for all procedures", tags: ["satisfaction", "pain-management"] },
    { title: "Optimize Pain Management scheduling", desc: "Reduce scheduling conflicts and improve appointment availability", tags: ["efficiency", "pain-management", "scheduling"] },
    { title: "Upgrade waiting room amenities", desc: "Install comfortable seating and entertainment options", tags: ["satisfaction", "facilities"] },
    { title: "Review and update patient intake forms", desc: "Streamline forms to reduce check-in time", tags: ["efficiency", "satisfaction"] },
    { title: "Create patient education materials", desc: "Develop easy-to-understand guides for common procedures", tags: ["satisfaction", "education"] },
    { title: "Implement online appointment booking", desc: "Deploy web-based scheduling system", tags: ["efficiency", "technology"] },
    { title: "Improve provider-to-provider communication", desc: "Implement secure messaging system between departments", tags: ["efficiency", "neurology", "pain-management"] },
  ];

  const owners = ["Dr. Chen", "Dr. Rodriguez", "Dr. Johnson", "Practice Manager", "Office Director", "Admin Team"];
  const statuses: ("ToDo" | "InProgress" | "Review" | "Done")[] = ["ToDo", "InProgress", "Review", "Done"];
  const statusDistribution = { ToDo: 30, InProgress: 25, Review: 20, Done: 25 };

  let taskCount = 0;

  Object.entries(statusDistribution).forEach(([status, count]) => {
    for (let i = 0; i < count; i++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const createdDaysAgo = Math.floor(Math.random() * 90);
      const createdAt = subDays(now, createdDaysAgo);
      
      let dueDate: Date;
      if (status === "Done") {
        dueDate = subDays(now, Math.floor(Math.random() * 30));
      } else if (status === "Review") {
        dueDate = addDays(now, Math.floor(Math.random() * 7));
      } else if (status === "InProgress") {
        dueDate = addDays(now, Math.floor(Math.random() * 14 + 7));
      } else {
        dueDate = addDays(now, Math.floor(Math.random() * 30 + 14));
      }

      tasks.push({
        id: `task-${taskCount + 1}`,
        title: template.title,
        description: template.desc,
        status: status as any,
        owner: owners[Math.floor(Math.random() * owners.length)],
        dueDate,
        tags: template.tags,
        createdAt,
        linkedFeedbackId: Math.random() < 0.3 ? `fb-${Math.floor(Math.random() * 250 + 1)}` : undefined,
      });

      taskCount++;
    }
  });

  return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Generate Appointments
export function generateAppointments(): Appointment[] {
  const appointments: Appointment[] = [];
  const now = new Date();
  const weekStart = subDays(now, now.getDay()); // Start of current week

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const appointmentTypes: ("New Patient" | "Follow-up" | "Procedure" | "Consultation")[] = 
    ["New Patient", "Follow-up", "Procedure", "Consultation"];

  let appointmentId = 1;

  // Generate appointments for each provider over the week
  providers.forEach(provider => {
    // Each provider works 4-5 days per week
    const workDays = Math.floor(Math.random() * 2) + 4;
    const workDayIndices = Array.from({ length: 7 }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, workDays);

    workDayIndices.forEach(dayIndex => {
      const date = addDays(weekStart, dayIndex);
      
      // Each provider has 6-10 appointments per day
      const appointmentsPerDay = Math.floor(Math.random() * 5) + 6;
      const selectedSlots = timeSlots
        .sort(() => Math.random() - 0.5)
        .slice(0, appointmentsPerDay);

      selectedSlots.forEach(startTime => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        const duration = Math.random() < 0.7 ? 30 : 60; // 70% are 30min, 30% are 60min
        const [hours, minutes] = startTime.split(":").map(Number);
        const endMinutes = minutes + duration;
        const endHours = hours + Math.floor(endMinutes / 60);
        const endTime = `${endHours.toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;

        const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
        
        let status: "Scheduled" | "Completed" | "Cancelled" | "No-Show" = "Scheduled";
        if (date < now) {
          const rand = Math.random();
          if (rand < 0.85) status = "Completed";
          else if (rand < 0.95) status = "Cancelled";
          else status = "No-Show";
        }

        appointments.push({
          id: `apt-${appointmentId}`,
          providerId: provider.id,
          providerName: provider.name,
          date,
          startTime,
          endTime,
          patientName: `${firstName} ${lastName}`,
          type,
          serviceLine: provider.specialty,
          status,
        });

        appointmentId++;
      });
    });
  });

  return appointments.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
}

// Generate historical analytics data
export function generateHistoricalMetrics() {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    months.push(format(subMonths(new Date(), i), 'MMM yyyy'));
  }

  return {
    patientVolume: months.map((month, i) => ({
      month,
      value: 850 + i * 50 + Math.floor(Math.random() * 100),
      trend: i > 0 ? (i * 5 + Math.floor(Math.random() * 10)) : 0
    })),
    revenue: months.map((month, i) => ({
      month,
      value: 320000 + i * 25000 + Math.floor(Math.random() * 20000),
      trend: i > 0 ? (i * 3 + Math.floor(Math.random() * 8)) : 0
    })),
    utilization: months.map((month, i) => ({
      month,
      value: 72 + i * 2 + Math.floor(Math.random() * 5),
      trend: i > 0 ? (i * 1.5 + Math.floor(Math.random() * 3)) : 0
    })),
    satisfaction: months.map((month, i) => ({
      month,
      satisfaction: 78 + i * 1.5 + Math.floor(Math.random() * 4),
      target: 85,
      previousYear: 72 + i * 1.2 + Math.floor(Math.random() * 3),
      trend: i > 0 ? (i * 1 + Math.floor(Math.random() * 2)) : 0
    })),
  };
}
