import React from 'react';
import { CalendarDays, CalendarX2, CheckCheck } from 'lucide-react';
import { Appointment, Task } from '../../sampleData';
import { format, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

interface ThisWeekWidgetProps {
  appointments: Appointment[];
  tasks: Task[];
}

const ThisWeekWidget: React.FC<ThisWeekWidgetProps> = ({ appointments, tasks }) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 }); // Saturday

  const weekAppointments = appointments.filter((apt) =>
    isWithinInterval(apt.date, { start: weekStart, end: weekEnd })
  );

  const weekTasks = tasks.filter(
    (task) =>
      !task.completed &&
      isWithinInterval(task.dueDate, { start: weekStart, end: weekEnd })
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 border-t-4 border-t-primary">
      <h2 className="text-base font-semibold mb-5 text-primary flex items-center gap-2">
        <CalendarDays className="w-4 h-4" />
        This Week
      </h2>

      <div className="space-y-5">
        {/* Upcoming Appointments */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Upcoming</h3>
          {weekAppointments.length > 0 ? (
            <div className="space-y-3">
              {weekAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: apt.color }}
                    />
                    <span className="text-gray-700 font-medium">{apt.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-4 mt-0.5">
                    {format(apt.date, 'EEE, MMM d')} at {apt.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-gray-300">
              <CalendarX2 className="w-5 h-5 mb-1.5" />
              <p className="text-xs">No appointments this week</p>
            </div>
          )}
        </div>

        {/* Tasks This Week */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Tasks</h3>
          {weekTasks.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-primary">
                  {weekTasks.filter((t) => t.priority === 'high').length}
                </p>
                <p className="text-xs text-primary mt-0.5">High</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-2xl font-bold text-primary-dark">
                  {weekTasks.filter((t) => t.priority === 'medium').length}
                </p>
                <p className="text-xs text-primary-dark mt-0.5">Medium</p>
              </div>
              <div className="bg-background-dark rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-600">
                  {weekTasks.filter((t) => t.priority === 'low').length}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Low</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-gray-300">
              <CheckCheck className="w-5 h-5 mb-1.5" />
              <p className="text-xs">No tasks this week</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {weekAppointments.length} appointment{weekAppointments.length !== 1 ? 's' : ''} · {weekTasks.length} task{weekTasks.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default ThisWeekWidget;