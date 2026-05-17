export const mockUser = {
  name: "Alex",
  avatar: "https://i.pravatar.cc/150?u=alex",
  role: "Senior Frontend Engineer",
  targetRole: "Engineering Manager",
  xp: 4250,
  level: 12,
  levelName: "Digital Optimizer",
  streak: 14,
};

export const dashboardActivity = [
  { day: "Mon", health: 65, finance: 70, career: 80 },
  { day: "Tue", health: 70, finance: 72, career: 82 },
  { day: "Wed", health: 80, finance: 75, career: 85 },
  { day: "Thu", health: 75, finance: 78, career: 87 },
  { day: "Fri", health: 82, finance: 74, career: 91 },
  { day: "Sat", health: 88, finance: 70, career: 90 },
  { day: "Sun", health: 85, finance: 72, career: 92 },
];

export const aiRecommendations = [
  {
    id: 1,
    title: "Optimize Sleep Schedule",
    description: "Your deep sleep dropped by 15%. Going to bed 30m earlier could improve your daily recovery.",
    type: "health",
    color: "purple",
  },
  {
    id: 2,
    title: "Subscription Alert",
    description: "You have 3 unused subscriptions costing $45/mo. Consider canceling to boost your savings rate.",
    type: "finance",
    color: "blue",
  },
  {
    id: 3,
    title: "System Design Prep",
    description: "You're 80% to your Engineering Manager goal. A 2-hour system design session is recommended today.",
    type: "career",
    color: "pink",
  },
];

export const healthStats = {
  score: 82,
  calories: 2847,
  sleep: 7.2,
  water: 8,
  bpm: 72,
  sleepData: [
    { day: "M", hours: 6.5 },
    { day: "T", hours: 7.0 },
    { day: "W", hours: 6.8 },
    { day: "T", hours: 7.5 },
    { day: "F", hours: 7.2 },
    { day: "S", hours: 8.1 },
    { day: "S", hours: 7.8 },
  ],
  workouts: [
    { id: 1, type: "HIIT", duration: "45m", calories: 420, date: "Today" },
    { id: 2, type: "Cycling", duration: "30m", calories: 310, date: "Yesterday" },
    { id: 3, type: "Weight Training", duration: "60m", calories: 550, date: "3 days ago" },
  ],
};

export const financeStats = {
  score: 74,
  income: 8400,
  expenses: 5230,
  savings: 3170,
  savingsRate: 37,
  categories: [
    { name: "Housing", value: 2500, color: "#6D28D9" },
    { name: "Food", value: 800, color: "#2563EB" },
    { name: "Transport", value: 400, color: "#EC4899" },
    { name: "Entertainment", value: 300, color: "#A855F7" },
    { name: "Other", value: 1230, color: "#9CA3AF" },
  ],
  transactions: [
    { id: 1, name: "Whole Foods", category: "Food", amount: -145.20, date: "Today" },
    { id: 2, name: "TechCorp Salary", category: "Income", amount: 4200.00, date: "Yesterday" },
    { id: 3, name: "Uber", category: "Transport", amount: -24.50, date: "Yesterday" },
    { id: 4, name: "Netflix", category: "Entertainment", amount: -15.99, date: "2 days ago" },
    { id: 5, name: "AWS Services", category: "Other", amount: -45.00, date: "3 days ago" },
    { id: 6, name: "Vanguard Index", category: "Savings", amount: -1000.00, date: "4 days ago" },
    { id: 7, name: "Equinox", category: "Health", amount: -250.00, date: "5 days ago" },
    { id: 8, name: "Sweetgreen", category: "Food", amount: -18.40, date: "5 days ago" },
  ],
  savingsTrend: [
    { month: "Jan", amount: 2100 },
    { month: "Feb", amount: 2400 },
    { month: "Mar", amount: 2200 },
    { month: "Apr", amount: 2800 },
    { month: "May", amount: 3170 },
  ]
};

export const careerStats = {
  score: 91,
  skills: [
    { subject: "Leadership", A: 85, fullMark: 100 },
    { subject: "Communication", A: 90, fullMark: 100 },
    { subject: "Technical", A: 95, fullMark: 100 },
    { subject: "Strategy", A: 75, fullMark: 100 },
    { subject: "Mentorship", A: 80, fullMark: 100 },
  ],
  milestones: [
    { id: 1, title: "System Design Mastery", progress: 100, completed: true },
    { id: 2, title: "Lead 3 Major Projects", progress: 66, completed: false },
    { id: 3, title: "Mentorship Program", progress: 40, completed: false },
    { id: 4, title: "Public Speaking / Guild", progress: 10, completed: false },
  ],
  projects: [
    { id: 1, title: "Micro-frontend Migration", impact: "High", effort: "High" },
    { id: 2, title: "Design System Revamp", impact: "High", effort: "Medium" },
    { id: 3, title: "Performance Budgeting", impact: "Medium", effort: "Low" },
  ]
};

export const chatMessages = [
  { id: 1, sender: "ai", text: "Welcome back to Mission Control, Alex. I've analyzed your latest biometrics and spending." },
  { id: 2, sender: "user", text: "How's my savings rate looking this month?" },
  { id: 3, sender: "ai", text: "You're at 37%, which is 2% higher than last month. However, if you reduce dining out by 1 meal per week, we project hitting 40% by month's end. Shall I update your goals?" },
];

export const goals = [
  { id: 1, name: "Run 5K", target: 5, current: 3.2, deadline: "Oct 15", category: "Health", color: "purple" },
  { id: 2, name: "Save $10K", target: 10000, current: 6500, deadline: "Dec 31", category: "Finance", color: "blue" },
  { id: 3, name: "Complete AWS Cert", target: 100, current: 80, deadline: "Nov 01", category: "Career", color: "pink" },
  { id: 4, name: "Read 24 books", target: 24, current: 18, deadline: "Dec 31", category: "Career", color: "violet" },
];

export const achievements = [
  { id: 1, name: "First Blood", desc: "Complete your first workout", icon: "Flame", unlocked: true },
  { id: 2, name: "Frugal Master", desc: "Save over 30% of income", icon: "PiggyBank", unlocked: true },
  { id: 3, name: "Night Owl", desc: "Code past midnight 5 times", icon: "Moon", unlocked: true },
  { id: 4, name: "Early Bird", desc: "Workout before 6am", icon: "Sun", unlocked: true },
  { id: 5, name: "Code Ninja", desc: "Commit 14 days straight", icon: "Code", unlocked: true },
  { id: 6, name: "Iron Lungs", desc: "Run a 10K", icon: "Wind", unlocked: true },
  { id: 7, name: "Investor", desc: "First stock purchase", icon: "TrendingUp", unlocked: true },
  { id: 8, name: "Hydrated", desc: "Drink 8 glasses of water 7 days straight", icon: "Droplets", unlocked: true },
  { id: 9, name: "Marathoner", desc: "Run a full marathon", icon: "Medal", unlocked: false },
  { id: 10, name: "Unicorn", desc: "Reach $1M Net Worth", icon: "Star", unlocked: false },
  { id: 11, name: "CTO Material", desc: "Reach Career Score 99", icon: "Award", unlocked: false },
  { id: 12, name: "Zen Master", desc: "Meditate 30 days straight", icon: "Brain", unlocked: false },
];