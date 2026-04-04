import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface GoogleEventListItemProps {
  id: string;
  title: string;
  start: string;
  allDay: boolean;
  color: string;
}

const GoogleEventListItem: React.FC<GoogleEventListItemProps> = ({ title, start, allDay, color }) => {
  const date = parseISO(start);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 relative">
      {/* Color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between ml-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          {!allDay && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>{format(date, 'h:mm a')}</span>
            </div>
          )}

          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1"
            style={{ backgroundColor: `${color}20`, color }}
          >
            Google Calendar
          </span>
        </div>

        <div className="ml-4">
          <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">G</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleEventListItem;
