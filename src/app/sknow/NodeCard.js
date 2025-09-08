'use client';
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function NodeCard({ data }) {
  const preview =
    (data.markdown && data.markdown.replace(/\s+/g, ' ').slice(0, 220)) ||
    (data.summary && data.summary.replace(/\s+/g, ' ').slice(0, 220)) ||
    '';

  return (
    <div
      className="rounded-xl shadow-sm p-3 border dark:border-neutral-700 border-neutral-300"
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, rgba(40,40,40,0.9), rgba(24,24,24,0.9))',
        color: '#fafafa',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ width: 8, height: 8 }} />

      <div className="text-sm font-semibold leading-tight">{data.title}</div>
      {!!preview && (
        <div className="text-[11px] opacity-80 mt-1 leading-snug" title={preview}>
          {preview}{preview.length >= 220 ? '…' : ''}
        </div>
      )}
      {!!data.tags?.length && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-2 py-[2px] rounded bg-neutral-800/70">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
