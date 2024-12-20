import React from 'react';
import { Cube } from 'lucide-react';

interface ModelViewerProps {
  modelUrl: string;
  title: string;
}

export function ModelViewer({ modelUrl, title }: ModelViewerProps) {
  return (
    <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
      <iframe
        src={modelUrl}
        title={`3D model of ${title}`}
        className="w-full h-full border-0"
        allow="xr-spatial-tracking"
      />
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
        <Cube className="w-4 h-4" />
        <span className="text-sm">3D View</span>
      </div>
    </div>
  );
}