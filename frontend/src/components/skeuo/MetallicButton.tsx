import React, { ReactNode } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface MetallicButtonProps {
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const MetallicButton: React.FC<MetallicButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  icon,
  children,
}) => {
  return (
    <button
      className="btn-metallic"
      onClick={onClick}
      disabled={disabled || loading}
      data-loading={loading}
    >
      <span className="btn-metallic-inner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {loading ? (
          <Loader2 size={20} className="btn-metallic-spinner" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </span>
      <span className="btn-metallic-shine" />
    </button>
  );
};

MetallicButton.displayName = 'MetallicButton';

export default MetallicButton;
