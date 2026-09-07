export interface JourneyEntry {
  type: 'experience' | 'education';
  title: string;
  org: string;
  period: string;
  sortDate: string; // ISO-ish for sorting, most recent first
  bullets?: string[];
  badge?: string;
  tech?: string[];
}

const entries: JourneyEntry[] = [
  {
    type: 'experience',
    title: 'Full-Stack Development Intern',
    org: 'AU Ignite Future Skills Academy',
    period: 'May 2025 – Jul 2025',
    sortDate: '2025-05',
    badge: 'INTERNSHIP',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Tailwind'],
    bullets: [
      'Developed and deployed responsive web applications using the MERN stack.',
      'Implemented secure REST APIs and integrated JWT authentication with MongoDB Atlas.',
      'Enhanced UI/UX with reusable React components and Tailwind CSS.',
      'Collaborated in agile sprints, performing version control and code reviews on GitHub.',
    ],
  },
  {
    type: 'experience',
    title: 'Android & Flutter Development Intern',
    org: 'LaunchED Global',
    period: 'Feb 2025 – Mar 2025',
    sortDate: '2025-02',
    badge: 'INTERNSHIP',
    tech: ['Flutter', 'Dart', 'Kotlin', 'Jetpack Compose', 'Firebase'],
    bullets: [
      'Built and deployed mobile applications using Flutter (Dart) and Jetpack Compose (Kotlin).',
      'Integrated Firebase Authentication and Firestore for secure login and real-time data.',
      'Developed a small-scale React Native + Firebase project.',
      'Used GitHub for collaborative development, issue tracking, and version control.',
    ],
  },
  {
    type: 'education',
    title: 'Master of Computer Application',
    org: 'JECRC University',
    period: 'Aug 2026 – Present',
    sortDate: '2026-08',
    badge: 'DEGREE // IN PROGRESS',
    tech: ['Advanced Algorithms', 'Cloud Computing', 'Distributed Systems', 'Software Engineering'],
  },
  {
    type: 'education',
    title: 'Bachelor of Computer Application',
    org: 'Poornima University',
    period: 'Aug 2023 – Apr 2026',
    sortDate: '2023-08',
    badge: 'GRADUATED',
    tech: ['Data Structures', 'Web Engineering', 'DBMS', 'Algorithms'],
  },
  {
    type: 'education',
    title: 'Senior Secondary (12th Grade)',
    org: 'Khelgaon Public School',
    period: 'Aug 2022 – Mar 2023',
    sortDate: '2022-08',
    badge: 'ACADEMICS',
  },
];

export const journey: JourneyEntry[] = [...entries].sort((a, b) =>
  a.sortDate < b.sortDate ? 1 : -1
);

export const experienceEntries = journey.filter((e) => e.type === 'experience');
export const educationEntries = journey.filter((e) => e.type === 'education');
