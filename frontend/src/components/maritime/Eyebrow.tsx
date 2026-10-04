import React, { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
}

const Eyebrow: React.FC<EyebrowProps> = ({ children, light = false }) => {
  const className = light ? 'eyebrow eyebrow--light' : 'eyebrow';
  return <span className={className}>{children}</span>;
};

Eyebrow.displayName = 'Eyebrow';

export default Eyebrow;
