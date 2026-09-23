import React, { ReactNode } from 'react';
import { Sparkles, Zap, FileText } from 'lucide-react';

interface WorkbenchCardProps {
  icon: 'sparkles' | 'zap' | 'file' | ReactNode;
  title: string;
  body: string;
  tint?: 'orange' | 'navy' | 'paper';
}

const iconMap: Record<string, ReactNode> = {
  sparkles: <Sparkles size={28} color="#4285F4" />,
  zap: <Zap size={28} color="#DB4437" />,
  file: <FileText size={28} color="#0F9D58" />,
};

const tintMap: Record<string, string> = {
  orange: 'rgba(243, 156, 62, 0.12)',
  navy: 'rgba(30, 58, 109, 0.12)',
  paper: 'rgba(141, 108, 72, 0.12)',
};

const WorkbenchCard: React.FC<WorkbenchCardProps> = ({ icon, title, body, tint = 'orange' }) => {
  const iconNode = typeof icon === 'string' ? (iconMap[icon] ?? iconMap.sparkles) : icon;
  const tintColor = tintMap[tint] ?? tintMap.orange;

  return (
    <div className="workbench-card">
      <div className="workbench-icon" style={{ background: tintColor }}>
        {iconNode}
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
};

WorkbenchCard.displayName = 'WorkbenchCard';

export default WorkbenchCard;
