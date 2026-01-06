import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Appointment } from '../../sampleData';
import Modal from '../common/Modal';
import { Clock, Tag, Calendar as CalendarIcon } from 'lucide-react';

// Setup the localizer for date-fns
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BigCalendarProps {
  appointments: Appointment[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: Appointment;
}

const BigCalendar: React.FC<BigCalendarProps> = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert appointments to calendar events
  const events: CalendarEvent[] = appointments.map((apt) => {
    const [hours, minutes] = apt.time.split(':');
    const isPM = apt.time.includes('PM');
    let hour = parseInt(hours);
    
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const startDate = new Date(apt.date);
    startDate.setHours(hour, parseInt(minutes.split(' ')[0]), 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Default 1 hour duration

    return {
      id: apt.id,
      title: apt.title,
      start: startDate,
      end: endDate,
      resource: apt,
    };
  });

  // Custom event style
  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: event.resource?.color || '#B85C38',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '0.875rem',
      padding: '2px 5px',
    };
    return {
      style,
    };
  };

  // Handle event click
  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.resource) {
      setSelectedAppointment(event.resource);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          popup
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {/* Appointment Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedAppointment.title}
              </h3>
            </div>

            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-5 h-5 mr-3 text-primary" />
              <span>{format(selectedAppointment.date, 'EEEE, MMMM d, yyyy')}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3 text-primary" />
              <span>{selectedAppointment.time}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Tag className="w-5 h-5 mr-3 text-primary" />
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${selectedAppointment.color}20`,
                  color: selectedAppointment.color,
                }}
              >
                {getTypeLabel(selectedAppointment.type)}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log('Edit appointment:', selectedAppointment);
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BigCalendar;