import React from 'react';
import { AuroqIcon } from './AuroqLogo';

export default function AnimatedAssistantLogo({ isResponding = false, className = "w-7 h-7" }) {
  return (
    <div className="relative">
      <AuroqIcon 
        className={`${className} transition-all`}
        style={{ height: '100%', width: 'auto' }}
      />
    </div>
  );
}
