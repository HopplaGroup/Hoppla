"use client"
// components/RateLimitTimer.tsx
import { useState, useEffect } from "react";
import * as m from "@/paraglide/messages.js";

interface RateLimitTimerProps {
  initialTimeMs: number;
  onTimerComplete?: () => void;
}

export default function RateLimitTimer({ 
  initialTimeMs, 
  onTimerComplete 
}: RateLimitTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeMs);
  
  useEffect(() => {
    if (timeRemaining <= 0) {
      if (onTimerComplete) onTimerComplete();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(timer);
          if (onTimerComplete) onTimerComplete();
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, onTimerComplete]);
  
  // Format the time nicely
  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  return (
    <div className="flex flex-col items-center py-4 px-6 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="text-amber-800 mb-2 font-medium">{m.lime_any_tapir_glow()}</div>
      <div className="flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-amber-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="text-lg font-bold text-amber-700">
          {formatTime(timeRemaining)}
        </span>
      </div>
      <p className="text-sm text-amber-700 text-center mt-2">
        {m.dull_hour_worm_nail()}
      </p>
    </div>
  );
}