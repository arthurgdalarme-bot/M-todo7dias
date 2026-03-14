import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { Node, Edge } from '../types';
import { Check, X, AlertTriangle, Star, ArrowRight, Loader2 } from 'lucide-react';

interface RendererProps {
  currentNode: Node;
  onNavigate: (targetId: string, handleId?: string) => void;
}

export const PageRenderer: React.FC<RendererProps> = ({ currentNode, onNavigate }) => {
  const content = currentNode.data.content || [];

  return (
    <motion.div
      key={currentNode.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden flex flex-col"
    >
      <div className="flex-1 p-6 space-y-6">
        {content.map((item: any) => (
          <ContentRenderer
            key={item.id}
            item={item}
            onNavigate={(handleId) => onNavigate(currentNode.id, handleId)}
          />
        ))}
      </div>
    </motion.div>
  );
};

const ContentRenderer: React.FC<{
  item: any;
  onNavigate: (handleId?: string) => void;
}> = ({ item, onNavigate }) => {
  const { type, data, id } = item;

  switch (type) {
    case 'progressV2':
      return (
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.targetPercentage}%` }}
            className="bg-sky-600 h-full"
          />
        </div>
      );

    case 'text':
    case 'textV3':
      return (
        <div
          className={cn(
            "prose prose-sm max-w-none text-gray-700",
            data.alignment === 'center' ? 'text-center' : 'text-left',
            data.size || 'text-base'
          )}
          dangerouslySetInnerHTML={{ __html: data.text || data.text?.content || '' }}
        />
      );

    case 'title':
      return (
        <div className={cn("space-y-2", data.alignment === 'center' ? 'text-center' : 'text-left')}>
          <h1
            className={cn("font-bold text-gray-900", data.titleSize || 'text-2xl')}
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
          {data.subtitle && (
            <p
              className={cn("text-gray-500", data.subtitleSize || 'text-sm')}
              dangerouslySetInnerHTML={{ __html: data.subtitle }}
            />
          )}
        </div>
      );

    case 'image':
      return null;

    case 'button':
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate(id)}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all",
            data.animation === 'pulse' ? 'animate-pulse' : ''
          )}
          style={{ backgroundColor: data.colors?.focus || '#0284c7' }}
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
      );

    case 'quiz':
      return (
        <div className="space-y-3">
          {data.content.map((option: any) => (
            <button
              key={option.id}
              onClick={() => onNavigate(option.id)}
              className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-sky-500 hover:bg-sky-50 transition-all text-left flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-sky-100">
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-sky-600" />
              </div>
              <div
                className="flex-1 text-gray-700 font-medium"
                dangerouslySetInnerHTML={{ __html: option.title }}
              />
            </button>
          ))}
        </div>
      );

    case 'benefits':
      return (
        <div
          className="p-5 rounded-2xl space-y-4"
          style={{ backgroundColor: data.colors?.background || '#f3f4f6' }}
        >
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            {data.icon === 'check' ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
            <span dangerouslySetInnerHTML={{ __html: data.title }} />
          </h3>
          <ul className="space-y-3">
            {data.content.map((benefit: any) => (
              <li key={benefit.id} className="flex items-start gap-3 text-sm text-gray-700">
                <div className="mt-1">
                  {data.icon === 'check' ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-400" />}
                </div>
                <div dangerouslySetInnerHTML={{ __html: benefit.text }} />
              </li>
            ))}
          </ul>
        </div>
      );

    case 'note':
      return (
        <div
          className="p-4 rounded-xl border-l-4 border-yellow-400 space-y-2"
          style={{ backgroundColor: data.colors?.background || '#fffbeb' }}
        >
          <div className="flex items-center gap-2 font-bold text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <div dangerouslySetInnerHTML={{ __html: data.title }} />
          </div>
          <div
            className="text-sm text-yellow-700"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        </div>
      );

    case 'reportV3':
      return (
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={364}
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * data.score) / 100 }}
                className="text-red-600"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{data.score}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500">Nível</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: data.title }} />
            <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
            <div className="text-red-600 font-bold" dangerouslySetInnerHTML={{ __html: data.result }} />
          </div>
        </div>
      );

    case 'testimony':
      return (
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-bold text-gray-900">{data.name}</div>
              <div className="text-xs text-gray-500">{data.place}</div>
            </div>
            <div className="ml-auto flex">
              {[...Array(data.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div
            className="text-sm text-gray-700 italic"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        </div>
      );

    case 'loading':
      return (
        <div className="py-12 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-sky-600 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900">{data.title}</h3>
            <p className="text-sm text-gray-500">{data.subtitle}</p>
          </div>
        </div>
      );

    case 'redirect':
      useEffect(() => {
        const timer = setTimeout(() => onNavigate(id), parseInt(data.time) * 1000);
        return () => clearTimeout(timer);
      }, []);
      return (
        <div className="py-12 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-sky-600 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900">{data.title}</h3>
            <p className="text-sm text-gray-500">{data.subtitle}</p>
          </div>
        </div>
      );

    case 'warranty':
      return (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Check className="w-6 h-6" />
          </div>
          <div className="font-bold text-emerald-900" dangerouslySetInnerHTML={{ __html: data.title }} />
          <div className="text-sm text-emerald-700" dangerouslySetInnerHTML={{ __html: data.text }} />
        </div>
      );

    case 'pricing':
      return (
        <div className="text-center space-y-2 py-4">
          <div className="text-xs uppercase tracking-widest text-gray-400 font-bold" dangerouslySetInnerHTML={{ __html: data.label }} />
          <div className="text-lg line-through text-gray-400" dangerouslySetInnerHTML={{ __html: data.title }} />
          <div className="text-4xl font-black text-gray-900" dangerouslySetInnerHTML={{ __html: data.pricing }} />
          <div className="text-xs text-gray-500 italic" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
        </div>
      );

    default:
      return null;
  }
};
