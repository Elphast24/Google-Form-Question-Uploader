import React, { ReactNode } from 'react';

interface MedallionProps {
  icon: ReactNode;
  size?: number;
  active?: boolean;
  variant?: 'default' | 'navy' | 'dark' | 'lg';
  label?: string;
  onClick?: () => void;
}

const Medallion: React.FC<MedallionProps> = ({
  icon,
  size = 130,
  active = false,
  variant = 'default',
  label,
  onClick,
}) => {
  const variantClass = `medallion--${variant}`;
  const activeClass = active ? 'medallion--active' : '';

  return (
    <div
      className={`medallion ${variantClass} ${activeClass}`}
      onClick={onClick}
    >
      <div
        className="medallion-circle"
        style={{ width: size, height: size }}
      >
        {icon}
      </div>
      {label && <h4>{label}</h4>}
    </div>
  );
};

Medallion.displayName = 'Medallion';

export default Medallion;
