// src/features/crosshair/SectionCard.tsx
import React from 'react';

interface SectionCardProps {
  heading: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ heading, children, className = '' }: SectionCardProps) {
  return (
    <div className={`bg-[#262626] border border-[#3a3a3a] rounded-lg p-4 ${className}`}>
      <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-[0.05em] mb-4">
        {heading}
      </h3>
      {children}
    </div>
  );
}
