// src/components/ui/CopyButton.tsx
// Locked behavior: accepts value prop, handles clipboard writing internally,
// shows brief success state after copy
import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = 'Copy', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Clipboard API may be unavailable in some environments
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button onClick={handleCopy} type="button" className={className}>
      {copied ? 'Copied!' : label}
    </button>
  );
}
