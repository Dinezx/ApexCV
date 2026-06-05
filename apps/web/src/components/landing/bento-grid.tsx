import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart3, FileSearch, LayoutGrid, MessageSquareText } from 'lucide-react';

const features = [
  {
    title: 'Precision parsing pipeline',
    detail: 'Extract structure from PDF and DOCX into name, contact, projects, skills, education, and experience graphs.',
    icon: FileSearch,
  },
  {
    title: 'Role-calibrated AI suggestions',
    detail: 'Generate missing keyword actions, rewrite prompts, and role-fit improvement plans in seconds.',
    icon: MessageSquareText,
  },
  {
    title: 'Executive-grade analytics',
    detail: 'Monitor ATS trajectories, resume revisions, recruiter signals, and decision timelines from one board.',
    icon: BarChart3,
  },
  {
    title: 'Composable product architecture',
    detail: 'Clean service boundaries and reusable UI primitives built for scale, speed, and maintainability.',
    icon: LayoutGrid,
  },
];

export function BentoGrid() {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card key={feature.title} className={index === 0 ? 'md:col-span-2 xl:col-span-2' : index === 2 ? 'xl:row-span-2' : ''}>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Badge>0{index + 1}</Badge>
                <Icon className="text-[color:var(--accent)]" size={22} />
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl tracking-[-0.04em] text-text-primary">{feature.title}</h3>
                <p className="max-w-md text-sm leading-7 text-text-secondary">{feature.detail}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
}