export type ThemeMode = 'dark' | 'light';

export type AuthToken = {
  access_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type ResumeRecord = {
  id: number;
  originalFilename: string;
  createdAt: string;
};

export type ResumeInsight = {
  id?: number;
  resumeId?: number;
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  roleMatch: string;
  summary: string;
  skillGap: string[];
  createdAt?: string;
};

export type RecruiterModeInsight = {
  analysisId: number;
  shortlistSignal: string;
  strengths: string[];
  concerns: string[];
};

export type ComparisonResult = {
  baseResumeId: number;
  targetResumeId: number;
  scoreDelta: number;
  missingKeywordsDelta: string[];
  summary: string;
};

export type JobDescriptionRecord = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type JobDescriptionMatchResult = {
  jobDescriptionId: number;
  resumeId: number;
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  summary: string;
  suggestions: string[];
  jobs?: Array<{
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    match_rate: number;
  }>;
};


export type DashboardOverview = {
  totalResumes: number;
  atsAverage: number;
  matchesGenerated: number;
  interviewsSecured: number;
  trend: Array<{ label: string; score: number }>;
  activity: Array<{ title: string; detail: string; time: string }>;
  skillHeatmap: Array<{ skill: string; level: number }>;
};

export type ChatReply = {
  response: string;
};

export type DashboardOverviewApi = {
  total_resumes: number;
  ats_average: number;
  matches_generated: number;
  interviews_secured: number;
  trend: Array<{ label: string; score: number }>;
  activity: Array<{ title: string; detail: string; time: string }>;
  skill_heatmap: Array<{ skill: string; level: number }>;
};