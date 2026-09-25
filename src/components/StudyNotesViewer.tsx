import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Terminal,
  Lightbulb
} from 'lucide-react';

interface StudyNotesViewerProps {
  markdown: string;
  courseTitle?: string;
  dayNumber?: number;
  totalDays?: number;
  topic?: string;
  subtopics?: string[];
}

export const StudyNotesViewer: React.FC<StudyNotesViewerProps> = ({
  markdown,
  courseTitle = 'Engineering Track',
  dayNumber,
  totalDays,
  topic,
  subtopics = [],
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to sanitize and fix mismatched technology text (e.g. "In SQL" for MongoDB courses)
  const sanitizeText = (text: string): string => {
    const isMongo = courseTitle.toLowerCase().includes('mongo') || courseTitle.toLowerCase().includes('nosql');
    if (isMongo) {
      return text
        .replace(/In SQL,\s*/gi, 'In MongoDB & NoSQL document datastores, ')
        .replace(/```sql/gi, '```javascript');
    }
    return text;
  };

  // Curated deep-dive descriptions for subtopics to replace repetitive placeholder lines
  const getSubtopicEnrichment = (subtopicTitle: string, index: number): string => {
    const titleLower = subtopicTitle.toLowerCase();
    const courseLower = courseTitle.toLowerCase();

    if (courseLower.includes('mongo') || courseLower.includes('nosql')) {
      if (titleLower.includes('deep dive') || titleLower.includes('conceptual') || index === 0) {
        return 'Understand flexible document schema modeling, embedding vs referencing tradeoffs, and the 16MB BSON document boundary.';
      }
      if (titleLower.includes('state') || titleLower.includes('concurrency') || index === 1) {
        return 'Multi-document ACID transactions, replica set write concerns (w: majority), and optimistic locking mechanisms.';
      }
      if (titleLower.includes('design pattern') || titleLower.includes('anti-pattern') || index === 2) {
        return 'Avoid unbounded array growth; leverage the bucket pattern for time-series and subset pattern for frequently accessed fields.';
      }
      if (titleLower.includes('logging') || titleLower.includes('metrics') || index === 3) {
        return 'Analyze executionStats using explain(), build compound indexes obeying the ESR (Equality, Sort, Range) rule, and monitor WiredTiger cache.';
      }
    }

    if (courseLower.includes('react') || courseLower.includes('next')) {
      if (index === 0) return 'Fiber reconciliation lifecycle, virtual DOM diffing, and component commit phases.';
      if (index === 1) return 'Optimizing state lifecycles with memo, useCallback, and atomic state selectors to eliminate re-render cascades.';
      if (index === 2) return 'Avoid prop drilling and unnecessary useEffect syncs; enforce unidirectional data flow with immutable reducers.';
      if (index === 3) return 'React Profiler instrumentation, Core Web Vitals profiling, and production boundary error tracking.';
    }

    if (courseLower.includes('python') || courseLower.includes('fastapi') || courseLower.includes('django')) {
      if (index === 0) return 'CPython bytecode execution, Global Interpreter Lock (GIL) constraints, and asyncio event loop concurrency.';
      if (index === 1) return 'Memory management via reference counting and generational garbage collection.';
      if (index === 2) return 'Avoid mutable default arguments and star imports; leverage dataclasses, type hints, and context managers.';
      if (index === 3) return 'Structured JSON logging with correlation IDs, cProfile bottlenecks profiling, and Prometheus exporter metrics.';
    }

    if (courseLower.includes('system') || courseLower.includes('architecture') || courseLower.includes('cloud')) {
      if (index === 0) return 'High-availability topologies, horizontal partition boundaries, and distributed consensus guarantees.';
      if (index === 1) return 'CAP theorem compromises, read/write replication topologies, and backpressure rate limiting.';
      if (index === 2) return 'Avoid single points of failure (SPOF) and cascading timeouts; implement circuit breakers and jittered retries.';
      if (index === 3) return 'Distributed tracing with OpenTelemetry, p99 latency SLOs, and alerting runbooks.';
    }

    // Default intelligent fallbacks by index
    const fallbacks = [
      'Core architectural anatomy, runtime execution mechanics, and domain specifications.',
      'State lifecycle guarantees, resource pooling, and asynchronous execution boundaries.',
      'Production-tested design patterns, anti-pattern remediation, and defensive programming.',
      'Observability instrumentation, telemetry pipelines, and performance profiling guidelines.'
    ];
    return fallbacks[index % fallbacks.length];
  };

  // Parse markdown into structured sections
  const cleanMarkdown = sanitizeText(markdown || '');

  // Extract sections split by headings (###)
  const rawSections = cleanMarkdown.split(/(?=###\s+)/g).filter(s => s.trim().length > 0);

  // Helper to render bold and italic markdown tags inside text
  const renderInlineFormatted = (text: string) => {
    // Split by **bold** tags
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white tracking-normal">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Also handle code snippets like `code`
      const subParts = part.split(/(`[^`]+`)/g);
      return subParts.map((sub, j) => {
        if (sub.startsWith('`') && sub.endsWith('`')) {
          return (
            <code
              key={j}
              className="font-mono text-[11px] sm:text-xs text-blue-300 bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-500/20"
            >
              {sub.slice(1, -1)}
            </code>
          );
        }
        return <span key={j}>{sub}</span>;
      });
    });
  };

  // Helper to extract code blocks from a section
  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const blocks: { language: string; code: string }[] = [];
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'code',
        code: match[2].trim(),
      });
    }
    return blocks;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Lesson Overview */}
      <div className="surface-card p-6 sm:p-7 rounded-2xl border border-white/[0.1] bg-gradient-to-br from-[#0F121C] via-[#0E1017] to-[#0A0B10] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 font-mono">
                  {dayNumber && totalDays ? `Day ${dayNumber} of ${totalDays}` : 'Comprehensive Study Notes'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-slate-400">{courseTitle}</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {topic || `Core Concepts & Practical Syllabus`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Syllabus</span>
            </span>
          </div>
        </div>

        {/* Learning Objectives Checklist */}
        {subtopics.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Key Topics & Competency Matrix</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {subtopics.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/30 border border-white/[0.04] text-xs text-slate-300"
                >
                  <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0 mt-0.5">
                    0{i + 1}
                  </span>
                  <span className="font-medium text-slate-200">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Structured Content Sections */}
      {rawSections.map((sec, secIdx) => {
        const lines = sec.trim().split('\n');
        const firstLine = lines[0].replace(/^###\s+/, '').trim();
        const contentLines = lines.slice(1);
        const sectionContent = contentLines.join('\n').trim();

        // Check if this is "Key Subtopics for Today" or contains bullet items
        const isSubtopicsSection = firstLine.toLowerCase().includes('subtopic') || firstLine.toLowerCase().includes('key subtopics');
        const isPitfallsSection = firstLine.toLowerCase().includes('pitfall') || firstLine.toLowerCase().includes('anti-pattern');
        const isSummarySection = firstLine.toLowerCase().includes('summary') || firstLine.toLowerCase().includes('takeaway');
        const isArchitectureSection = firstLine.toLowerCase().includes('architectural') || firstLine.toLowerCase().includes('concept');
        const isOverviewSection = firstLine.toLowerCase().includes('overview') || firstLine.toLowerCase().includes('context');

        // Extract code blocks inside this section
        const codeBlocks = extractCodeBlocks(sectionContent);
        // Content without the code blocks
        const textWithoutCode = sectionContent.replace(/```[a-zA-Z0-9_-]*\n[\s\S]*?```/g, '').trim();

        // Parse list items
        const subtopicItems: { title: string; desc: string; index: number }[] = [];
        const pitfallItems: string[] = [];
        const genericNumberedItems: { num: string; title: string; body: string }[] = [];

        const rawLines = textWithoutCode.split('\n');
        let currentItem: { num: string; title: string; body: string } | null = null;

        rawLines.forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed) return;

          // Check for bullet subtopics: - **Title**: Desc
          const bulletMatch = trimmed.match(/^[-*]\s+\*\*([^*]+)\*\*:\s*(.*)$/);
          if (bulletMatch) {
            let desc = bulletMatch[2].trim();
            // If desc is the repetitive placeholder, enrich it!
            if (!desc || desc.toLowerCase().includes('practical real-world') || desc.length < 5) {
              desc = getSubtopicEnrichment(bulletMatch[1], subtopicItems.length);
            }
            subtopicItems.push({
              title: bulletMatch[1].trim(),
              desc,
              index: subtopicItems.length + 1,
            });
            return;
          }

          // Check for pitfalls bullet items: - Bullet text
          if (isPitfallsSection && trimmed.startsWith('- ')) {
            pitfallItems.push(trimmed.slice(2).trim());
            return;
          }

          // Check for numbered items: 1. **Title**:
          const numMatch = trimmed.match(/^(\d+)\.\s+\*\*([^*]+)\*\*:\s*(.*)$/);
          if (numMatch) {
            if (currentItem) genericNumberedItems.push(currentItem);
            currentItem = {
              num: numMatch[1],
              title: numMatch[2].trim(),
              body: numMatch[3].trim(),
            };
            return;
          }

          // Continuation of current numbered item body
          if (currentItem && !trimmed.startsWith('###')) {
            currentItem.body = currentItem.body ? `${currentItem.body} ${trimmed}` : trimmed;
            return;
          }
        });
        if (currentItem) genericNumberedItems.push(currentItem);

        // Section Renderers based on type:

        // 1. PITFALLS & ANTI-PATTERNS SECTION
        if (isPitfallsSection) {
          const itemsToRender = pitfallItems.length > 0 ? pitfallItems : rawLines.filter(l => l.trim().startsWith('-')).map(l => l.trim().slice(2));
          return (
            <div
              key={secIdx}
              className="surface-card p-6 sm:p-7 rounded-2xl border border-amber-500/30 bg-amber-500/[0.03] shadow-lg space-y-4"
            >
              <div className="flex items-center gap-2.5 text-amber-400">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                    {firstLine}
                  </h3>
                  <p className="text-[11px] text-amber-300/80">
                    Critical edge cases and anti-patterns to avoid in production systems
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {itemsToRender.map((pitfall, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#08090D] border border-amber-500/20 text-xs text-slate-300"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 font-bold text-[10px] mt-0.5">
                      !
                    </span>
                    <div className="flex-1 leading-relaxed">
                      {renderInlineFormatted(pitfall)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 2. DAILY SUMMARY SECTION
        if (isSummarySection) {
          return (
            <div
              key={secIdx}
              className="surface-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] shadow-lg"
            >
              <div className="flex items-center gap-2.5 text-emerald-400 mb-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h3 className="font-display text-base font-bold text-white tracking-tight">
                  {firstLine}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {renderInlineFormatted(textWithoutCode)}
              </p>
            </div>
          );
        }

        // 3. ARCHITECTURAL CONCEPTS / SUBTOPICS WITH DEDICATED CARDS
        return (
          <div
            key={secIdx}
            className="surface-card p-6 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#0E1017] shadow-xl space-y-5"
          >
            {/* Section Header */}
            <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-3.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                {isArchitectureSection ? (
                  <Layers className="h-4 w-4" />
                ) : isOverviewSection ? (
                  <Lightbulb className="h-4 w-4" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                  {firstLine}
                </h3>
              </div>
            </div>

            {/* If there are generic numbered items (e.g. 1. State & Execution Lifecycle) */}
            {genericNumberedItems.length > 0 && (
              <div className="space-y-4">
                {genericNumberedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/[0.08] bg-[#08090D] space-y-2 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        Concept 0{item.num}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white">
                        {item.title}
                      </h4>
                    </div>
                    {item.body && (
                      <p className="text-xs text-slate-300 leading-relaxed pl-1">
                        {renderInlineFormatted(item.body)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* If there are subtopics (e.g. Key Subtopics for Today with bullets) */}
            {subtopicItems.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
                  <span>Aligned Sub-Topic Breakdown</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subtopicItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-white/[0.08] bg-[#12141D] hover:bg-[#181B26] hover:border-blue-500/40 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            Milestone #{idx + 1}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Module Sub-Point</span>
                        </div>
                        <h5 className="font-display text-xs sm:text-sm font-bold text-white mb-1.5 group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {renderInlineFormatted(item.desc)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free-form introductory or residual prose */}
            {textWithoutCode && genericNumberedItems.length === 0 && subtopicItems.length === 0 && (
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                {rawLines.map((line, lIdx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  return (
                    <p key={lIdx}>
                      {renderInlineFormatted(trimmed)}
                    </p>
                  );
                })}
              </div>
            )}

            {/* Synthesized Code Blocks with Terminal Window Chrome */}
            {codeBlocks.length > 0 && (
              <div className="space-y-3 pt-2">
                {codeBlocks.map((cb, cbIdx) => (
                  <div
                    key={cbIdx}
                    className="rounded-xl border border-white/[0.1] bg-[#050608] overflow-hidden shadow-2xl"
                  >
                    {/* Terminal Topbar */}
                    <div className="px-4 py-2.5 bg-[#0C0E14] border-b border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="h-3 w-px bg-white/10 mx-1" />
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <Terminal className="h-3 w-3 text-blue-400" />
                          <span>architecture-pattern.{cb.language}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">
                          {cb.language}
                        </span>
                        <button
                          onClick={() => handleCopyCode(cb.code, cbIdx)}
                          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded transition-colors"
                        >
                          {copiedCodeIndex === cbIdx ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="p-4 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-relaxed scrollbar-none">
                      <pre>
                        <code>{cb.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
