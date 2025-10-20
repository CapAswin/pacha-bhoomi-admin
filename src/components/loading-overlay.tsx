'use client';

import React from 'react';
import { useLoading } from '@/context/loading-context';

export default function LoadingOverlay({
  message = 'Loading...',
}: {
  message?: string;
}) {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end h-6 space-x-2">
          <span
            className="block h-2 w-2 rounded-full bg-white animate-bounceDelay"
            style={{ animationDelay: '0s' }}
          />
          <span
            className="block h-2 w-2 rounded-full bg-white animate-bounceDelay"
            style={{ animationDelay: '0.12s' }}
          />
          <span
            className="block h-2 w-2 rounded-full bg-white animate-bounceDelay"
            style={{ animationDelay: '0.24s' }}
          />
        </div>
        <span className="text-sm text-white/90">{message}</span>
      </div>

      <style jsx global>{`
        @keyframes bounceDelay {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        .animate-bounceDelay {
          animation: bounceDelay 0.9s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
