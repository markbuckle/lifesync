import React from 'react';
import { Calendar, CheckSquare } from 'lucide-react';
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Today
      </h2>
      
      <div className="space-y-4">
        {/* Appointments Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Appointments</h3>
          {todayAppointments.length > 0 ? (
            <div className="space-y-2">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center text-sm">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: apt.color }}
                  />
                  <span className="text-gray-600">{apt.time}</span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-800">{apt.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No appointments today</p>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks Due</h3>
          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-start text-sm">
                  <CheckSquare className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-gray-800">{task.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tasks due today</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} • {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default TodayWidget;