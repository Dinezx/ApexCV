import type {
  AuthToken,
  ChatReply,
  ComparisonResult,
  DashboardOverview,
  DashboardOverviewApi,
  JobDescriptionMatchResult,
  JobDescriptionRecord,
  RecruiterModeInsight,
  ResumeInsight,
  ResumeRecord,
  UserProfile,
} from './types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8000';
const tokenStorageKey = 'resume-analyzer-token';

export function hasStoredAuthToken() {
  return Boolean(readToken());
}

function readToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(tokenStorageKey);
}

export function writeToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(tokenStorageKey, token);
}

export function clearToken() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(tokenStorageKey);
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = readToken();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }

    const payload = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(payload?.detail ?? `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

const emptyDashboard: DashboardOverview = {
  totalResumes: 0,
  atsAverage: 0,
  matchesGenerated: 0,
  interviewsSecured: 0,
  trend: [],
  activity: [],
  skillHeatmap: [],
};

function toDashboardOverview(payload: DashboardOverviewApi): DashboardOverview {
  return {
    totalResumes: payload.total_resumes,
    atsAverage: payload.ats_average,
    matchesGenerated: payload.matches_generated,
    interviewsSecured: payload.interviews_secured,
    trend: payload.trend,
    activity: payload.activity,
    skillHeatmap: payload.skill_heatmap,
  };
}

function toResumeInsight(payload: {
  id: number;
  resume_id: number;
  ats_score: number;
  role_match: string;
  summary: string;
  suggestions: string[];
  missing_keywords: string[];
  skill_gap: string[];
  created_at: string;
}): ResumeInsight {
  return {
    id: payload.id,
    resumeId: payload.resume_id,
    atsScore: payload.ats_score,
    roleMatch: payload.role_match,
    summary: payload.summary,
    suggestions: payload.suggestions,
    missingKeywords: payload.missing_keywords,
    skillGap: payload.skill_gap,
    createdAt: payload.created_at,
  };
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  if (!readToken()) {
    return emptyDashboard;
  }

  try {
    const response = await fetchJson<DashboardOverviewApi>('/api/v1/dashboard/overview');
    return toDashboardOverview(response);
  } catch {
    return emptyDashboard;
  }
}

export async function getResumeInsight(resumeId: string): Promise<ResumeInsight> {
  if (!readToken()) {
    throw new Error('Sign in before loading resume insights.');
  }

  const response = await fetchJson<{
    id: number;
    resume_id: number;
    ats_score: number;
    role_match: string;
    summary: string;
    suggestions: string[];
    missing_keywords: string[];
    skill_gap: string[];
    created_at: string;
  }>(`/api/v1/analysis/${resumeId}`);
  return toResumeInsight(response);
}

export async function authenticate(path: '/api/v1/auth/login' | '/api/v1/auth/register', body: Record<string, unknown>): Promise<AuthToken> {
  const response = await fetchJson<AuthToken>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  writeToken(response.access_token);
  return response;
}

export function getCurrentUser() {
  return fetchJson<UserProfile>('/api/v1/auth/me');
}

export function uploadResume(file: File) {
  const token = readToken();
  if (!token) {
    return Promise.reject(new Error('Please sign in before uploading a resume.'));
  }

  const form = new FormData();
  form.append('file', file);
  return fetch(`${baseUrl}/api/v1/resumes/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  })
    .then(async (response) => {
      if (response.ok) {
        const payload = (await response.json()) as { id: number; original_filename: string; created_at: string };
        return {
          id: payload.id,
          originalFilename: payload.original_filename,
          createdAt: payload.created_at,
        } satisfies ResumeRecord;
      }

      if (response.status === 401) {
        clearToken();
      }

      const payload = await response.json().catch(() => null) as { detail?: string } | null;
      throw new Error(payload?.detail ?? `Upload failed with status ${response.status}`);
    })
    .catch((error) => {
      throw error instanceof Error ? error : new Error('Upload failed. Please try again.');
    });
}

export function listResumes(): Promise<ResumeRecord[]> {
  if (!readToken()) {
    return Promise.resolve([]);
  }

  return fetchJson<Array<{ id: number; original_filename: string; created_at: string }>>('/api/v1/resumes')
    .then((items) =>
      items.map((item) => ({
        id: item.id,
        originalFilename: item.original_filename,
        createdAt: item.created_at,
      }))
    )
    .catch(() => []);
}

export async function runAnalysis(payload: { resumeId: number; targetRole: string; includeRecruiterMode?: boolean }): Promise<ResumeInsight> {
  const response = await fetchJson<{
    id: number;
    resume_id: number;
    ats_score: number;
    role_match: string;
    summary: string;
    suggestions: string[];
    missing_keywords: string[];
    skill_gap: string[];
    created_at: string;
  }>('/api/v1/analysis', {
    method: 'POST',
    body: JSON.stringify({
      resume_id: payload.resumeId,
      target_role: payload.targetRole,
      include_recruiter_mode: payload.includeRecruiterMode ?? false,
    }),
  });
  return toResumeInsight(response);
}

export function getRecruiterMode(analysisId: number): Promise<RecruiterModeInsight> {
  return fetchJson<{
    analysis_id: number;
    shortlist_signal: string;
    strengths: string[];
    concerns: string[];
  }>(`/api/v1/analysis/${analysisId}/recruiter`).then((payload) => ({
    analysisId: payload.analysis_id,
    shortlistSignal: payload.shortlist_signal,
    strengths: payload.strengths,
    concerns: payload.concerns,
  }));
}

export function compareResumes(baseResumeId: number, targetResumeId: number): Promise<ComparisonResult> {
  return fetchJson<{
    base_resume_id: number;
    target_resume_id: number;
    score_delta: number;
    missing_keywords_delta: string[];
    summary: string;
  }>('/api/v1/resumes/compare', {
    method: 'POST',
    body: JSON.stringify({ base_resume_id: baseResumeId, target_resume_id: targetResumeId }),
  }).then((payload) => ({
    baseResumeId: payload.base_resume_id,
    targetResumeId: payload.target_resume_id,
    scoreDelta: payload.score_delta,

    missingKeywordsDelta: payload.missing_keywords_delta,
    summary: payload.summary,
  }));
}


export async function generateJobDescription(title: string): Promise<string> {
  const response = await fetchJson<{ content: string }>('/api/v1/job-descriptions/generate', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  return response.content;
}


export function listJobDescriptions(): Promise<JobDescriptionRecord[]> {
  if (!readToken()) {
    return Promise.resolve([]);
  }

  return fetchJson<Array<{ id: number; title: string; content: string; created_at: string }>>('/api/v1/job-descriptions')
    .then((items) =>
      items.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: item.created_at,
      }))
    )
    .catch(() => []);
}

export function matchResumeToJobDescription(payload: { resumeId: number; title: string; content: string }): Promise<JobDescriptionMatchResult> {
  return fetchJson<{
    job_description_id: number;
    resume_id: number;
    match_percentage: number;
    matched_keywords: string[];
    missing_keywords: string[];
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
  }>('/api/v1/job-descriptions/match', {
    method: 'POST',
    body: JSON.stringify({
      resume_id: payload.resumeId,
      title: payload.title,
      content: payload.content,
    }),
  })
    .then((result) => ({
      jobDescriptionId: result.job_description_id,
      resumeId: result.resume_id,
      matchPercentage: result.match_percentage,
      matchedKeywords: result.matched_keywords,
      missingKeywords: result.missing_keywords,
      summary: result.summary,
      suggestions: result.suggestions,
      jobs: result.jobs,
    }));
}

export function askChatAssistant(message: string, resumeId?: number): Promise<ChatReply> {
  return fetchJson<ChatReply>('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({ message, resume_id: resumeId }),
  });
}
