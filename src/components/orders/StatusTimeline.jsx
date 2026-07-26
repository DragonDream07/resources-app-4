import React from 'react';

const STAGES = [
  { key: 'CONFIRMED', label: 'Confirmed', description: 'Order placed & confirmed' },
  { key: 'PACKED', label: 'Packed', description: 'Items packed and ready' },
  { key: 'SHIPPED', label: 'Shipped', description: 'Out for delivery' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Delivered to you' },
];

const STAGE_ORDER = ['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

function getStageIndex(status) {
  const idx = STAGE_ORDER.indexOf(status);
  return idx;
}

function StageIcon({ completed, active }) {
  if (completed) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 border-2 border-indigo-600">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (active) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-indigo-600">
        <div className="w-3 h-3 rounded-full bg-indigo-600" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300">
      <div className="w-3 h-3 rounded-full bg-gray-300" />
    </div>
  );
}

export default function StatusTimeline({ currentStatus, timeline }) {
  const currentIndex = getStageIndex(currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  const getTimestampForStage = (stageKey) => {
    if (!Array.isArray(timeline)) return null;
    const entry = timeline.find((t) => t.status === stageKey);
    if (!entry) return null;
    return new Date(entry.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 border-2 border-red-400">
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
            <p className="text-xs text-red-500 mt-0.5">This order has been cancelled.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ol className="relative flex flex-col sm:flex-row sm:items-start gap-0">
        {STAGES.map((stage, idx) => {
          const completed = currentIndex > idx;
          const active = currentIndex === idx;
          const isLast = idx === STAGES.length - 1;
          const timestamp = getTimestampForStage(stage.key);

          return (
            <li key={stage.key} className="flex-1 flex flex-col sm:flex-row items-start">
              <div className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-0 w-full">
                {/* Stage icon + connector */}
                <div className="flex flex-col sm:flex-row items-center">
                  <StageIcon completed={completed} active={active} />
                  {!isLast && (
                    <div
                      className={`hidden sm:block h-0.5 w-full min-w-[2rem] mt-0 mx-1 ${
                        completed ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                      style={{ width: '100%' }}
                    />
                  )}
                  {!isLast && (
                    <div
                      className={`block sm:hidden w-0.5 h-8 ml-3.5 ${
                        completed ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="sm:mt-2 sm:text-center pb-4 sm:pb-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      completed || active ? 'text-indigo-700' : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{stage.description}</p>
                  {timestamp && (
                    <p className="text-xs text-gray-400 mt-0.5">{timestamp}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
