import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Tag, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'meeting' | 'doctor' | 'personal' | 'work';
  color: string;
  notes?: string;
}

interface AppointmentListItemProps {
  appointment: Appointment;
  onEdit: () => void;
  onDelete: () => void;
}

const AppointmentListItem: React.FC<AppointmentListItemProps> = ({
  appointment,
  onEdit,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

   return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors relative">
      {/* Color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: appointment.color }}
      />

      <div className="flex items-start justify-between ml-3">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {appointment.title}
          </h3>

          {/* Date */}
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          {/* Time */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>{appointment.time}</span>
          </div>

          {/* Type Badge */}
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-gray-400" />
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${appointment.color}20`,
                color: appointment.color,
              }}
            >
              {getTypeLabel(appointment.type)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-start gap-2 ml-4">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>

          {/* More Options Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentListItem;