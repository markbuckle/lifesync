import React from 'react';
import { CalendarRange, CalendarX2 } from 'lucide-react';
import { Appointment } from '../../sampleData';
import { format, endOfWeek, addDays } from 'date-fns';

interface UpcomingWidgetProps {
  appointments: Appointment[];
}

const UpcomingWidget: React.FC<UpcomingWidgetProps> = ({ appointments }) => {
  const today = new Date();
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const rangeEnd = addDays(today, 30);

  const upcomingAppointments = appointments
    .filter((apt) => apt.date > weekEnd && apt.date <= rangeEnd)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 border-t-4 border-t-primary">
      <h2 className="text-base font-semibold mb-5 text-primary flex items-center gap-2">
        <CalendarRange className="w-4 h-4" />
        Coming Up
      </h2>

      <div>
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Next 30 Days</h3>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.slice(0, 6).map((apt) => (
              <div key={apt.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: apt.color }}
                  />
                  <span className="text-gray-700 font-medium truncate flex-1">{apt.title}</span>
                </div>
                <p className="text-xs text-gray-400 ml-4 mt-0.5">
                  {format(apt.date, 'EEE, MMM d')} at {apt.time}
                </p>
              </div>
            ))}
            {upcomingAppointments.length > 6 && (
              <p className="text-xs text-gray-400 pl-4">+{upcomingAppointments.length - 6} more</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 text-gray-300">
            <CalendarX2 className="w-5 h-5 mb-1.5" />
            <p className="text-xs">Nothing scheduled beyond this week</p>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {upcomingAppointments.length} appointment{upcomingAppointments.length !== 1 ? 's' : ''} in the next 30 days
        </p>
      </div>
    </div>
  );
};

export default UpcomingWidget;
