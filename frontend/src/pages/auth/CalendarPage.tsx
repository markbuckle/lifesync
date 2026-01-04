import React, { useState } from 'react';
import BigCalendar from '../../components/calendar/BigCalendar';
import AppointmentListItem from '../../components/appointments/AppointmentListItem';
import AppointmentModal from '../../components/appointments/AppointmentModal';
import { sampleAppointments, Appointment } from '../../sampleData';
import { Calendar as CalendarIcon, List } from 'lucide-react';

const CalendarPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const handleCreateAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: String(appointments.length + 1),
    };
    setAppointments([...appointments, appointment]);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = (updatedAppointment: Omit<Appointment, 'id'>) => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((apt) =>
          apt.id === editingAppointment.id
            ? { ...updatedAppointment, id: apt.id }
            : apt
        )
      );
      setEditingAppointment(null);
    } else {
      handleCreateAppointment(updatedAppointment);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Group by upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = sortedAppointments.filter(
    (apt) => apt.date >= today
  );
  const pastAppointments = sortedAppointments.filter((apt) => apt.date < today);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                view === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                view === 'calendar'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Appointment
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-8">
          {/* Upcoming Appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Upcoming ({upcomingAppointments.length})
            </h2>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentListItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-600">No upcoming appointments</p>
              </div>
            )}
          </div>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Past ({pastAppointments.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {pastAppointments.map((appointment) => (
                  <AppointmentListItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <BigCalendar appointments={appointments} />
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAppointment}
        editingAppointment={editingAppointment}
      />
    </div>
  );
};

export default CalendarPage;