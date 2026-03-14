import React, { useState, useMemo } from 'react';
import { PROJECT_DATA } from './data';
import { PageRenderer } from './components/Renderer';
import { Node } from './types';
import { AnimatePresence } from 'motion/react';

import { ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  // Find the initial node
  const initialNodeId = useMemo(() => {
    const rootEdge = PROJECT_DATA.edges.find(e => e.source === 'root');
    return rootEdge ? rootEdge.target : null;
  }, []);

  const [currentNodeId, setCurrentNodeId] = useState<string | null>(initialNodeId);

  const currentNode = useMemo(() => {
    return PROJECT_DATA.nodes.find(n => n.id === currentNodeId) || null;
  }, [currentNodeId]);

  const handleNavigate = (sourceId: string, handleId?: string) => {
    // Find edge matching source and handle (if provided)
    let edge = PROJECT_DATA.edges.find(e => 
      e.source === sourceId && e.sourceHandle === handleId
    );

    // Fallback: if no exact match with handle, find any edge from this source
    if (!edge && handleId) {
      edge = PROJECT_DATA.edges.find(e => e.source === sourceId && !e.sourceHandle);
    }

    // Second fallback: just find the first edge from this source
    if (!edge) {
      edge = PROJECT_DATA.edges.find(e => e.source === sourceId);
    }

    if (edge) {
      const targetNode = PROJECT_DATA.nodes.find(n => n.id === edge.target);
      if (targetNode) {
        if (targetNode.type === 'function' && targetNode.data.type === 'link') {
          window.open(targetNode.data.url, '_blank');
        } else {
          setCurrentNodeId(targetNode.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  if (!currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">Página não encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <AnimatePresence mode="wait">
        <PageRenderer
          key={currentNode.id}
          currentNode={currentNode}
          onNavigate={handleNavigate}
        />
      </AnimatePresence>
      
      {/* Footer Branding */}
      <footer className="max-w-md mx-auto py-8 px-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full bg-white shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Site Seguro</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full bg-white shadow-sm">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">SSL Criptografado</span>
          </div>
        </div>
        <div className="text-gray-400 text-xs">
          <p>&copy; 2026 {PROJECT_DATA.name}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
