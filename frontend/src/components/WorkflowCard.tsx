import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WorkflowCardProps {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  isActive?: boolean;
  onMouseEnter?: () => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  step,
  title,
  desc,
  icon: Icon,
  isActive = false,
  onMouseEnter,
}) => {
  return (
    <div
      className={`wc-card ${isActive ? 'wc-card--active' : ''}`}
      onMouseEnter={onMouseEnter}
    >
      {/* Watermark Numbering */}
      <span className="wc-watermark">{step}</span>

      {/* Top Element: Icon Badge */}
      <div className="wc-icon-badge">
        <Icon size={22} />
      </div>

      {/* Content Structure */}
      <h4 className="wc-title">{title}</h4>
      <p className="wc-desc">{desc}</p>
    </div>
  );
};

export default WorkflowCard;
