import type { DashboardOverview, ResumeInsight } from './types';

export const mockInsight: ResumeInsight = {
  atsScore: 84,
  missingKeywords: ['FastAPI', 'cloud deployment', 'workflow automation'],
  suggestions: [
    'Move measurable impact into the first 120 words.',
    'Add a dedicated skills cluster for stack-specific keywords.',
    'Make the summary role-targeted instead of generic.',
  ],
  roleMatch: 'Senior AI Product Engineer',
  summary:
    'The resume reads as a strong product engineer profile, but the AI focus can be sharpened with stronger ATS signals and a clearer delivery narrative.',
  skillGap: ['Prompt design', 'MLOps', 'FastAPI', 'vector search', 'observability'],
};

export const mockDashboard: DashboardOverview = {
  totalResumes: 148,
  atsAverage: 78,
  matchesGenerated: 61,
  interviewsSecured: 19,
  trend: [
    { label: 'Mon', score: 67 },
    { label: 'Tue', score: 71 },
    { label: 'Wed', score: 76 },
    { label: 'Thu', score: 73 },
    { label: 'Fri', score: 81 },
    { label: 'Sat', score: 84 },
    { label: 'Sun', score: 79 },
  ],
  activity: [
    { title: 'Resume parsed', detail: 'Product resume with 7 detected skills', time: '2m ago' },
    { title: 'ATS model refreshed', detail: 'Role-targeting suggestions regenerated', time: '14m ago' },
    { title: 'Export created', detail: 'Analysis PDF sent to recruiter view', time: '1h ago' },
  ],
  skillHeatmap: [
    { skill: 'TypeScript', level: 92 },
    { skill: 'FastAPI', level: 68 },
    { skill: 'OpenAI', level: 88 },
    { skill: 'SQL', level: 74 },
    { skill: 'Docker', level: 81 },
  ],
};