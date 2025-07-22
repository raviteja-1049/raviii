import React, { useState } from 'react';
import { Radio, Users } from 'lucide-react';
import RealtimeCollaboration from './RealtimeCollaboration';

interface RealtimeIndicatorProps {
  projectId?: string;
}

export default function RealtimeIndicator({ projectId }: RealtimeIndicatorProps) {
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);

  if (!projectId) return null;

  return (
    <>
      <button
        onClick={() => setIsCollaborationOpen(true)}
        className="fixed bottom-20 right-4 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-30"
        title="Open Live Collaboration"
      >
        <div className="relative">
          <Users className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      <RealtimeCollaboration
        projectId={projectId}
        isOpen={isCollaborationOpen}
        onClose={() => setIsCollaborationOpen(false)}
      />
    </>
  );
}