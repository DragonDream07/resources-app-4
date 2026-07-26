import React from 'react';
import packageIcon from '@/assets/icons/package.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import externalLinkIcon from '@/assets/icons/external-link.svg';

function TrackingStep({ event, location, timestamp, isLast }) {
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <li className="relative flex gap-4">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />
      )}

      {/* Dot */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-6 h-6 mt-1">
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white ring-2 ring-indigo-200" />
      </div>

      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{event || 'Update'}</p>
        {location && (
          <div className="flex items-center gap-1 mt-0.5">
            <img src={mapPinIcon} alt="" className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
            <p className="text-xs text-gray-500">{location}</p>
          </div>
        )}
        {formattedTime && (
          <p className="text-xs text-gray-400 mt-0.5">{formattedTime}</p>
        )}
      </div>
    </li>
  );
}

export default function TrackingInfo({ tracking }) {
  if (!tracking) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-center">
        <img src={packageIcon} alt="" className="w-10 h-10 mx-auto opacity-30 mb-2" aria-hidden="true" />
        <p className="text-sm text-gray-500">Tracking information is not yet available.</p>
      </div>
    );
  }

  const { carrier, trackingNumber, trackingUrl, estimatedDelivery, events } = tracking;

  const formattedDelivery = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={packageIcon} alt="" className="w-6 h-6 text-indigo-600" aria-hidden="true" />
            <div>
              {carrier && (
                <p className="text-sm font-semibold text-indigo-900">{carrier}</p>
              )}
              {trackingNumber && (
                <p className="text-xs text-indigo-600 font-mono mt-0.5">#{trackingNumber}</p>
              )}
            </div>
          </div>

          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150 flex-shrink-0"
            >
              Track on carrier site
              <img src={externalLinkIcon} alt="" className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>

        {formattedDelivery && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-indigo-500 font-medium">Estimated Delivery:</span>
            <span className="text-xs text-indigo-800 font-semibold">{formattedDelivery}</span>
          </div>
        )}
      </div>

      {/* Events timeline */}
      <div className="px-5 pt-5 pb-1">
        {Array.isArray(events) && events.length > 0 ? (
          <ul className="space-y-0">
            {events.map((ev, idx) => (
              <TrackingStep
                key={ev.id || idx}
                event={ev.event || ev.description}
                location={ev.location}
                timestamp={ev.timestamp || ev.createdAt}
                isLast={idx === events.length - 1}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 pb-4">
            No tracking events yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
