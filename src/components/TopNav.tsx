import React from 'react';

export type TopView = 'quest' | 'help' | 'progress' | 'facilitator';

interface TopNavProps {
  activeView: TopView;
  onSelectView: (view: TopView) => void;
  onOpenExport: () => void;
  onGoHome: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onSelectView,
  onOpenExport,
  onGoHome,
}) => {
  const navItems: { id: TopView; label: string }[] = [
    { id: 'quest', label: 'Mission' },
    { id: 'help', label: 'Get Help' },
    { id: 'progress', label: 'Progress Card' },
    { id: 'facilitator', label: 'Facilitator Notes' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={onGoHome}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
        >
          Debug Quest
        </button>

        {/* Zone 2: Concise single-line text nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isActive
                    ? 'border-blue-700 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Export Notes
          </button>
        </div>
      </div>

      {/* Compact mobile nav bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden border-t border-slate-100 px-4 flex items-center gap-4 overflow-x-auto"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`py-2.5 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
