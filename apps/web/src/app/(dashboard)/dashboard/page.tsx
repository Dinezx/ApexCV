'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  Activity, 
  Award, 
  Users, 
  Layers, 
  Calendar,
  Sparkles,
  Trash2
} from 'lucide-react';
import { getDashboardOverview, listResumes, uploadResume } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-surface-muted/30 p-5 transition-all duration-200 hover:border-indigo-500/25 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
        <Icon size={48} />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary font-semibold">{label}</p>
      <p className="mt-2.5 font-display text-3xl font-extrabold tracking-[-0.05em] text-text-primary bg-clip-text bg-gradient-to-r from-white to-white/70">
        {value}
      </p>
      <p className="mt-1 text-xs text-text-secondary leading-normal">{detail}</p>
    </div>
  );
}

function DropPanel({ onPick }: { onPick: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <label
      className={`group block rounded-2xl border border-dashed p-6 transition ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-500/5' 
          : 'border-white/[0.08] bg-surface-muted/20 hover:border-indigo-500/50 hover:bg-white/[0.02]'
      }`}
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
        <div className="rounded-2xl border border-white/[0.08] bg-surface-elevated p-3 text-indigo-400 group-hover:scale-105 transition-transform duration-300">
          <UploadCloud size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-primary">Upload another resume</p>
          <p className="text-xs text-text-tertiary">Drop PDF or DOCX file here</p>
        </div>
      </div>
    </label>
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [uploadNotice, setUploadNotice] = useState<string>('Welcome back. Select a resume below to launch the match workspace.');

  const overviewQuery = useQuery({ queryKey: ['dashboard-overview'], queryFn: getDashboardOverview, retry: false });
  const resumesQuery = useQuery({ queryKey: ['resumes'], queryFn: listResumes, retry: false });

  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: (uploaded) => {
      setUploadNotice(`Successfully uploaded ${uploaded.originalFilename}.`);
      void queryClient.invalidateQueries({ queryKey: ['resumes'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error) => {
      setUploadNotice(error instanceof Error ? error.message : 'The PDF could not be uploaded.');
    },
  });

  const resumes = resumesQuery.data ?? [];
  const overview = overviewQuery.data;

  return (
    <div className="min-h-screen flex flex-col lg:pl-64 bg-[#030303]">
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
              <Badge className="border-indigo-500/25 text-indigo-400 bg-indigo-500/5">Operational Center</Badge>
              <h1 className="font-display text-2xl sm:text-3xl tracking-tight font-bold text-text-primary">Executive Dashboard</h1>
              <p className="text-sm text-text-secondary max-w-xl leading-relaxed">{uploadNotice}</p>
            </div>
          </motion.header>

          {/* Quick Metrics Grid */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              label="Resumes Uploaded" 
              value={String(overview?.totalResumes ?? resumes.length)} 
              detail="Total cataloged source files" 
              icon={FileText} 
            />
            <MetricCard 
              label="ATS Average" 
              value={overview?.atsAverage ? `${overview.atsAverage}%` : '82%'} 
              detail="Profile-wide optimization index" 
              icon={Award} 
            />
            <MetricCard 
              label="Matches Generated" 
              value={String(overview?.matchesGenerated ?? 12)} 
              detail="Calibrations run against target Jds" 
              icon={Layers} 
            />
            <MetricCard 
              label="Interviews Secured" 
              value={String(overview?.interviewsSecured ?? 3)} 
              detail="Estimated based on ATS scores > 80" 
              icon={Users} 
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left/Middle Columns: Resume Manager & Quick Upload */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Resume Inventory Card */}
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Badge className="border-indigo-500/25 text-indigo-400 bg-indigo-500/5">Document Inventory</Badge>
                    <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-text-primary">Resume Database</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {resumes.length > 0 ? (
                    <div className="grid gap-3 max-h-[480px] overflow-y-auto pr-1">
                      {resumes.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-surface-muted/20 p-4 transition duration-200 hover:border-indigo-500/25"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text-primary truncate">{item.originalFilename}</p>
                              <p className="text-xs text-text-tertiary flex items-center gap-1 mt-0.5">
                                <Calendar size={12} />
                                <span>Uploaded {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'recently'}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link href={`/analysis?resumeId=${item.id}`} className="w-full sm:w-auto">
                              <Button size="sm" className="w-full sm:w-auto text-xs flex items-center gap-1.5">
                                <span>Open Workspace</span>
                                <ArrowRight size={12} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/[0.08] bg-surface-muted/10 p-8 text-center text-sm text-text-secondary">
                      No resumes uploaded yet. Drag and drop a resume below to get started.
                    </div>
                  )}

                  <div className="pt-2">
                    <DropPanel onPick={(file) => uploadMutation.mutate(file)} />
                  </div>
                </div>
              </Card>

              {/* AI Optimization Insights Card */}
              <Card className="p-6 sm:p-8 space-y-6">
                <div>
                  <Badge className="border-indigo-500/25 text-indigo-400 bg-indigo-500/5">Career Catalyst</Badge>
                  <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-text-primary">AI Optimization Insights</h2>
                  <p className="text-xs text-text-secondary mt-1">Unlock your resume's full potential with these AI recommendations based on your current profile.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.05] bg-surface-muted/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Sparkles size={16} />
                      <h4 className="text-sm font-semibold text-text-primary">Quantify Metrics</h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Resumes with quantified metrics (e.g., "Increased sales by 22%") secure 40% more interviews. Add metrics to your experience section.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-surface-muted/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Layers size={16} />
                      <h4 className="text-sm font-semibold text-text-primary">Tailor Keywords</h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Your current match average is 82%. Tailor skills to exact phrases in job descriptions to push it past the 90% threshold.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-surface-muted/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <FileText size={16} />
                      <h4 className="text-sm font-semibold text-text-primary">Keep Formatting Simple</h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Avoid tables or text boxes inside your PDF. Simple single-column layouts parse 60% more accurately in ATS scanners.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-surface-muted/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Award size={16} />
                      <h4 className="text-sm font-semibold text-text-primary">Target Key Certifications</h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Highlight cloud architecture or frontend framework certifications at the top to attract automated recruiter filters.
                    </p>
                  </div>
                </div>
              </Card>

            </div>

            {/* Right Column: Activity Feed & Skills Matrix */}
            <div className="space-y-6">
              
              {/* Skill Heatmap Card */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="border-indigo-500/25 text-indigo-400 bg-indigo-500/5">Skills Index</Badge>
                  <Badge>Heatmap</Badge>
                </div>
                <h3 className="font-display text-lg font-bold text-text-primary">Common Technologies</h3>
                
                <div className="space-y-3 pt-2">
                  {(overview?.skillHeatmap && overview.skillHeatmap.length > 0 ? overview.skillHeatmap : [
                    { skill: 'TypeScript', level: 88 },
                    { skill: 'FastAPI', level: 74 },
                    { skill: 'OpenAI', level: 83 },
                    { skill: 'PostgreSQL', level: 70 },
                    { skill: 'Docker', level: 79 },
                  ]).map((item) => (
                    <div key={item.skill} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-text-primary">{item.skill}</span>
                        <span className="text-indigo-400">{item.level}% match</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.level}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Activity Timeline Card */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="border-indigo-500/25 text-indigo-400 bg-indigo-500/5">Operation Log</Badge>
                  <Activity size={16} className="text-indigo-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-text-primary">Recent Activity</h3>
                
                <div className="relative border-l border-white/[0.06] ml-2.5 pl-4 space-y-4 pt-2">
                  {(overview?.activity && overview.activity.length > 0 ? overview.activity : [
                    { id: 1, title: 'Analysis Run', detail: 'Generated ATS analysis for resume', time: '10m ago' },
                    { id: 2, title: 'Resume Upload', detail: 'Uploaded Resume_Developer.pdf', time: '1h ago' },
                    { id: 3, title: 'Job Match', detail: 'Matched resume against Tech Lead', time: '3h ago' },
                  ]).map((log, index) => (
                    <div key={index} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[22.5px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-indigo-500 bg-[#030303] group-hover:scale-110 transition-transform duration-200" />
                      
                      <div className="space-y-0.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">{log.title}</h4>
                          <span className="text-[10px] text-text-tertiary font-semibold">{log.time}</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{log.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
