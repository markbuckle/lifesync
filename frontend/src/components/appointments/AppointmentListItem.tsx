import React from 'react';
import { Calendar, Clock, Tag, MoreVertical } from 'lucide-react';
import { Appointment } from '../../sampleData';
import { format } from 'date-fns';

interface AppointmentListItemProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
}

const AppointmentListItem: React.FC<AppointmentListItemProps> = ({
  appointment,
  onEdit,
  onDelete,
}) => {
  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        {/* Left side - Color indicator and details */}
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-1 h-16 rounded-full flex-shrink-0"
            style={{ backgroundColor: appointment.color }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {appointment.title}
            </h3>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="w-4 h-4" />
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${appointment.color}20`,
                    color: appointment.color,
                  }}
                >
                  {getTypeLabel(appointment.type)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(appointment)}
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            Edit
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentListItem;