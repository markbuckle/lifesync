import React from 'react';
import { Calendar, CheckSquare, CalendarX2, CheckCheck } from 'lucide-react';
import { Appointment, Task } from '../../sampleData';
import { format } from 'date-fns';

interface TodayWidgetProps {
  appointments: Appointment[];
  tasks: Task[];
}

const TodayWidget: React.FC<TodayWidgetProps> = ({ appointments, tasks }) => {
  const todayAppointments = appointments.filter(
    (apt) => format(apt.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  
  const todayTasks = tasks.filter(
    (task) => !task.completed && format(task.dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 border-t-4 border-t-primary">
      <h2 className="text-base font-semibold mb-5 text-primary flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Today
      </h2>

      <div className="space-y-5">
        {/* Appointments Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Appointments</h3>
          {todayAppointments.length > 0 ? (
            <div className="space-y-2.5">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center text-sm gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: apt.color }}
                  />
                  <span className="text-gray-400 tabular-nums">{apt.time}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-700">{apt.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-gray-300">
              <CalendarX2 className="w-5 h-5 mb-1.5" />
              <p className="text-xs">No appointments today</p>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Tasks Due</h3>
          {todayTasks.length > 0 ? (
            <div className="space-y-2.5">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-start text-sm gap-2">
                  <CheckSquare className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{task.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-gray-300">
              <CheckCheck className="w-5 h-5 mb-1.5" />
              <p className="text-xs">No tasks due today</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} · {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default TodayWidget;