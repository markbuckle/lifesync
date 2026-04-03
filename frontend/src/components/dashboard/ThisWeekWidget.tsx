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
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary">
      <h2 className="text-base font-semibold mb-3 text-primary flex items-center">
        <CalendarDays className="w-5 h-5 mr-2" />
        This Week
      </h2>

      <div className="space-y-3">
        {/* Upcoming Appointments */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming</h3>
          {weekAppointments.length > 0 ? (
            <div className="space-y-2">
              {weekAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: apt.color }}
                    />
                    <span className="text-gray-800 font-medium">{apt.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-4">
                    {format(apt.date, 'EEE, MMM d')} at {apt.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-3 text-gray-400">
              <CalendarX2 className="w-6 h-6 mb-1 opacity-50" />
              <p className="text-sm italic">No appointments this week</p>
            </div>
          )}
        </div>

        {/* Tasks This Week */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks</h3>
          {weekTasks.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-primary/10 rounded-lg p-2">
                <p className="text-2xl font-bold text-primary">
                  {weekTasks.filter((t) => t.priority === 'high').length}
                </p>
                <p className="text-xs text-primary">High</p>
              </div>
              <div className="bg-secondary rounded-lg p-2">
                <p className="text-2xl font-bold text-primary-dark">
                  {weekTasks.filter((t) => t.priority === 'medium').length}
                </p>
                <p className="text-xs text-primary-dark">Medium</p>
              </div>
              <div className="bg-background-dark rounded-lg p-2">
                <p className="text-2xl font-bold text-gray-600">
                  {weekTasks.filter((t) => t.priority === 'low').length}
                </p>
                <p className="text-xs text-gray-600">Low</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-3 text-gray-400">
              <CheckCheck className="w-6 h-6 mb-1 opacity-50" />
              <p className="text-sm italic">No tasks this week</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {weekAppointments.length} appointment{weekAppointments.length !== 1 ? 's' : ''} • {weekTasks.length} task{weekTasks.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default ThisWeekWidget;