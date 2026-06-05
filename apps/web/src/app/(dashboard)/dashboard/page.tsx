'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Settings, 
  Shield, 
  AlertTriangle, 
  MapPin, 
  DollarSign, 
  Check,
  History
} from 'lucide-react';
import { getDashboardOverview, listJobDescriptions, listResumes, matchResumeToJobDescription, uploadResume } from '@/lib/api';
import type { JobDescriptionMatchResult, JobDescriptionRecord, ResumeRecord } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

const demoJobDescription = {
  title: 'Senior AI Product Engineer',
  content:
    'We are looking for a Senior AI Product Engineer with strong FastAPI, React, PostgreSQL, Docker, and OpenAI experience. The ideal candidate owns deployment, observability, and ATS-friendly technical storytelling.',
};

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted/40 p-4 transition-all duration-200 hover:border-[color:var(--accent)]">
      <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-[-0.05em] text-text-primary">{value}</p>
      <p className="mt-1 text-xs text-text-secondary leading-normal">{detail}</p>
    </div>
  );
}

function DropPanel({ onPick }: { onPick: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <label
      className={`group block rounded-2xl border border-dashed p-6 transition ${isDragging ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)]' : 'border-border bg-surface-muted/40 hover:border-[color:var(--accent)]'}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
          onPick(file);
        }
      }}
    >
      <input
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onPick(file);
          }
        }}
      />
      <div className="flex flex-col items-center text-center gap-2">
        <div className="rounded-2xl border border-border bg-surface-elevated p-3 text-[color:var(--accent)] group-hover:scale-105 transition-transform">
          <UploadCloud size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-primary">Drag & drop your resume</p>
          <p className="text-xs text-text-tertiary">Supports PDF and DOCX formats</p>
        </div>
      </div>
    </label>
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [jobTitle, setJobTitle] = useState(demoJobDescription.title);
  const [jobContent, setJobContent] = useState(demoJobDescription.content);
  const [result, setResult] = useState<JobDescriptionMatchResult | null>(null);
  const [uploadingLabel, setUploadingLabel] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string>('Upload a resume to start a guided match analysis.');
  const [checkedSuggestions, setCheckedSuggestions] = useState<Record<string, boolean>>({});
  const [showHistory, setShowHistory] = useState(false);

  const overviewQuery = useQuery({ queryKey: ['dashboard-overview'], queryFn: getDashboardOverview, retry: false });
  const resumesQuery = useQuery({ queryKey: ['resumes'], queryFn: listResumes, retry: false });
  const jobDescriptionsQuery = useQuery({ queryKey: ['job-descriptions'], queryFn: listJobDescriptions, retry: false });

  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: (uploaded) => {
      setResumeId(uploaded.id);
      setUploadingLabel(uploaded.originalFilename);
      setResult(null);
      setCheckedSuggestions({});
      setUploadNotice(`${uploaded.originalFilename} is ready for analysis.`);
      void queryClient.invalidateQueries({ queryKey: ['resumes'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error) => {
      setUploadingLabel(null);
      setResult(null);
      setUploadNotice(error instanceof Error ? error.message : 'The PDF could not be uploaded.');
    },
  });

  const matchMutation = useMutation({
    mutationFn: () => {
      if (!resumeId) {
        throw new Error('Upload a resume before running a match.');
      }
      return matchResumeToJobDescription({ resumeId, title: jobTitle, content: jobContent });
    },
    onSuccess: (matched) => {
      setResult(matched);
      setCheckedSuggestions({});
      setUploadNotice('Match analysis calibrated successfully.');
    },
    onError: (error) => {
      setResult(null);
      setUploadNotice(error instanceof Error ? error.message : 'The match could not be generated.');
    },
  });

  const resumes = resumesQuery.data ?? [];
  const jobDescriptions = jobDescriptionsQuery.data ?? [];

  const selectedResume = useMemo<ResumeRecord | null>(
    () => resumes.find((item) => item.id === resumeId) ?? (resumeId && uploadingLabel ? { id: resumeId, originalFilename: uploadingLabel, createdAt: '' } : null) ?? resumes[0] ?? null,
    [resumes, resumeId, uploadingLabel]
  );
  const canAnalyze = Boolean(resumeId && jobTitle.trim() && jobContent.trim() && !uploadMutation.isPending && !matchMutation.isPending);

  useEffect(() => {
    if (!resumeId && resumes.length > 0) {
      setResumeId(resumes[0].id);
    }
  }, [resumes, resumeId]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030303]">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          
          {/* Header Workspace Details */}
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[28px] p-6 flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-2">
              <Badge>Dashboard</Badge>
              <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-text-primary">Operational Intelligence</h1>
              <p className="text-sm text-text-secondary max-w-xl leading-relaxed">{uploadNotice}</p>
            </div>
            <div className="grid grid-cols-2 md:flex gap-4 items-center">
              <Metric label="Match score" value={result ? `${result.matchPercentage}%` : '-'} detail="Score based on target job description" />
              <Metric label="Analysed JDs" value={String(jobDescriptions.length)} detail="Saved snapshots in your profile" />
            </div>
          </motion.header>

          {/* Sequential Flow Container */}
          <div className="flex flex-col gap-6">

            {/* SECTION 1: Upload & Calibrate */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column: Upload Resume */}
              <Card className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge className="border-accent/30 text-accent bg-accent-soft/10">01. Document Source</Badge>
                      <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-text-primary">Source Resumes</h2>
                    </div>
                  </div>
                  
                  <DropPanel onPick={(file) => uploadMutation.mutate(file)} />
                  
                  {uploadingLabel && (
                    <div className="rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-secondary flex items-center gap-2">
                      <FileText size={16} className="text-[color:var(--accent)]" />
                      <span>Active File: <strong>{uploadingLabel}</strong></span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <p className="text-xs uppercase tracking-wider text-text-tertiary font-semibold">Uploaded Resumes</p>
                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                      {resumes.length > 0 ? resumes.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setResumeId(item.id);
                            setUploadingLabel(item.originalFilename);
                          }}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${resumeId === item.id ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)]' : 'border-border bg-surface-muted hover:border-[color:var(--accent)]'}`}
                        >
                          <span className="text-sm font-medium text-text-primary truncate max-w-xs">{item.originalFilename}</span>
                          <ArrowRight size={14} className="text-text-tertiary" />
                        </button>
                      )) : (
                        <div className="rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-secondary">
                          No resumes uploaded yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right Column: Target Job Calibration */}
              <Card className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Badge className="border-accent/30 text-accent bg-accent-soft/10">01. Job Calibrator</Badge>
                    <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-text-primary">Define Target Role</h2>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History size={14} />
                    <span>History</span>
                  </Button>
                </div>

                {showHistory ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Saved Snapshots</p>
                      <Button variant="secondary" size="sm" className="h-6 text-[10px]" onClick={() => setShowHistory(false)}>Close</Button>
                    </div>
                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                      {jobDescriptions.length > 0 ? jobDescriptions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setJobTitle(item.title);
                            setJobContent(item.content);
                            setShowHistory(false);
                          }}
                          className="rounded-xl border border-border bg-surface-muted p-3 text-left hover:border-[color:var(--accent)] transition space-y-1 block w-full"
                        >
                          <p className="font-semibold text-xs text-text-primary truncate">{item.title}</p>
                          <p className="text-[10px] leading-relaxed text-text-secondary line-clamp-2">{item.content}</p>
                        </button>
                      )) : (
                        <div className="rounded-xl border border-border bg-surface-muted p-4 text-center text-xs text-text-secondary">
                          No saved job calibration history.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <Input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="e.g. Senior AI Engineer" />
                    <textarea
                      value={jobContent}
                      onChange={(event) => setJobContent(event.target.value)}
                      className="min-h-52 rounded-2xl border border-border bg-surface-muted p-4 text-sm leading-relaxed text-text-primary outline-none focus:border-[color:var(--accent)]"
                      placeholder="Paste full job description requirements here..."
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    disabled={!canAnalyze}
                    onClick={() => {
                      if (!resumeId) {
                        setUploadNotice('Upload a resume first.');
                        return;
                      }
                      matchMutation.mutate();
                    }}
                  >
                    <Sparkles size={16} /> {matchMutation.isPending ? 'Analyzing...' : 'Analyze Match'}
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    setJobTitle(demoJobDescription.title);
                    setJobContent(demoJobDescription.content);
                  }}>
                    Load Demo JD
                  </Button>
                </div>
              </Card>
            </div>

            {/* SECTION 2: ATS Score with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="story-section p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <Badge className="border-accent/30 text-accent bg-accent-soft/10">02. ATS Calibration</Badge>
              </div>
              <div className="absolute top-6 right-6">
                <Badge>ATS Engine Active</Badge>
              </div>
              
              <div className="relative flex items-center justify-center mt-8">
                {/* SVG Circular Gauge */}
                <svg width="220" height="220" className="rotate-[-90deg]">
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="rgba(88, 180, 255, 0.05)"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Glow effect back-track */}
                  <motion.circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="var(--accent)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 90}
                    initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - (result?.matchPercentage ?? 0) / 100) }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.5))' }}
                  />
                </svg>
                {/* Center Value */}
                <div className="absolute flex flex-col items-center justify-center">
                  <motion.span 
                    key={result ? result.matchPercentage : 0}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-5xl font-extrabold tracking-tighter text-text-primary"
                  >
                    {result ? `${result.matchPercentage}%` : '--%'}
                  </motion.span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary mt-2">Resume Fit</span>
                </div>
              </div>
              
              <div className="max-w-md mt-6 space-y-2">
                <h3 className="font-display text-lg font-bold text-text-primary">
                  {result ? (result.matchPercentage >= 80 ? "Highly Compatible Match" : result.matchPercentage >= 60 ? "Moderate Calibration Required" : "Significant Alignment Required") : "Calibration Pending"}
                </h3>
                <p className="text-sm text-text-secondary">
                  {result 
                    ? `Your resume covers ${result.matchedKeywords.length} key attributes requested by this position.` 
                    : "Please input your target role and click 'Analyze Match' in Section 1 to calculate score."
                  }
                </p>
              </div>
            </motion.div>

            {/* SECTION 3: Role-based Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="story-section p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge className="border-accent/30 text-accent bg-accent-soft/10">03. Target Fit Analysis</Badge>
                <Badge>AI Insights</Badge>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
                  <Sparkles size={20} className="text-accent" /> Fit Summary for <span className="text-accent-2">{result ? jobTitle : "(Not Calibrated)"}</span>
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary bg-surface-muted/30 border border-border/50 rounded-2xl p-5">
                  {result ? result.summary : "No calibration summary generated. Complete the match analysis in Section 1 to receive a comprehensive evaluation of your compatibility."}
                </p>
              </div>
            </motion.div>

            {/* SECTION 4: Required Skills Needed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="story-section p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <Badge className="border-accent/30 text-accent bg-accent-soft/10">04. Skill Gap Matrix</Badge>
                <Badge>Keywords</Badge>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Matched Skills */}
                <div className="rounded-2xl border border-green-500/15 bg-green-500/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Covered Skills ({result?.matchedKeywords.length ?? 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result && result.matchedKeywords.length > 0 ? (
                      result.matchedKeywords.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold uppercase tracking-wider">{tag}</span>
                      ))
                    ) : (
                      <span className="text-xs text-text-tertiary">No direct matches.</span>
                    )}
                  </div>
                </div>
                
                {/* Missing Skills */}
                <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                    <AlertTriangle size={18} className="shrink-0" />
                    <span>Missing Skills / Gaps ({result?.missingKeywords.length ?? 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result && result.missingKeywords.length > 0 ? (
                      result.missingKeywords.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold uppercase tracking-wider">{tag}</span>
                      ))
                    ) : (
                      <span className="text-xs text-text-tertiary">No missing keywords detected.</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SECTION 5: Improvements Needed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="story-section p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <Badge className="border-accent/30 text-accent bg-accent-soft/10">05. Calibration Suggestions</Badge>
                <Badge>Coaching Checklist</Badge>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold tracking-tight text-text-primary">Optimize Resume Structure</h3>
                  <p className="text-xs text-text-secondary">Review the tailored suggestions below. Check them off as you optimize your resume file.</p>
                </div>
                <div className="grid gap-3 mt-4">
                  {result && result.suggestions.length > 0 ? (
                    result.suggestions.map((suggestion) => {
                      const isChecked = Boolean(checkedSuggestions[suggestion]);
                      return (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setCheckedSuggestions(prev => ({ ...prev, [suggestion]: !prev[suggestion] }))}
                          className={`flex items-start gap-4 rounded-2xl border text-left px-5 py-4 transition-all duration-200 ${
                            isChecked 
                              ? 'border-green-500/25 bg-green-500/5 text-green-400/80 line-through decoration-green-500/30' 
                              : 'border-border bg-surface-muted/40 hover:border-accent text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <div className={`mt-0.5 rounded-lg border p-1 shrink-0 flex items-center justify-center transition-colors duration-200 ${
                            isChecked 
                              ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                              : 'border-border bg-surface-elevated text-transparent'
                          }`}>
                            <Check size={12} className={isChecked ? 'opacity-100' : 'opacity-0'} />
                          </div>
                          <span className="text-sm font-medium leading-relaxed">{suggestion}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-border bg-surface-muted/40 p-5 text-center text-sm text-text-secondary">
                      No suggestions available. Complete the calibration in Section 1 to generate dynamic optimization steps.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* SECTION 6: Job Vacancies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="story-section p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <Badge className="border-accent/30 text-accent bg-accent-soft/10">06. Matched Vacancies</Badge>
                <Badge>Market Match</Badge>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold tracking-tight text-text-primary">Recommended Opportunities</h3>
                  <p className="text-xs text-text-secondary">Real-world vacancies aligned with your calibrated role and coverable keywords.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-4">
                  {result && result.jobs && result.jobs.length > 0 ? (
                    result.jobs.map((job, idx) => (
                      <motion.div
                        key={`${job.title}-${idx}`}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl border border-border bg-surface-muted/45 p-5 flex flex-col justify-between gap-4 transition-all hover:border-accent hover:shadow-lg hover:shadow-accent-soft/5"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-accent">{job.company}</p>
                              <h4 className="font-bold text-sm text-text-primary line-clamp-1">{job.title}</h4>
                            </div>
                            <Badge className="border-green-500/30 text-green-400 bg-green-500/5 text-[10px] uppercase font-bold tracking-wider shrink-0">
                              {job.match_rate}% Match
                            </Badge>
                          </div>
                          
                          <div className="space-y-1.5 text-xs text-text-secondary">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-text-tertiary" />
                              <span>{job.location}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1.5">
                                <DollarSign size={12} className="text-text-tertiary" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                            {job.description}
                          </p>
                        </div>
                        
                        <Button size="sm" className="w-full mt-2 text-xs flex items-center justify-center gap-1">
                          <span>View Job Details</span>
                          <ArrowRight size={12} />
                        </Button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-2xl border border-border bg-surface-muted/40 p-8 text-center text-sm text-text-secondary">
                      No matched job vacancies available. Complete the calibration to generate real-world job suggestions.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
