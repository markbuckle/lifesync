import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_APPOINTMENTS } from '../../graphql/queries';
import { 
  CREATE_APPOINTMENT_MUTATION, 
  UPDATE_APPOINTMENT_MUTATION,
  DELETE_APPOINTMENT_MUTATION 
} from '../../graphql/mutations';
import BigCalendar from '../../components/calendar/BigCalendar';
import AppointmentListItem from '../../components/appointments/AppointmentListItem';
import AppointmentModal from '../../components/appointments/AppointmentModal';
import { Calendar as CalendarIcon, List } from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'meeting' | 'doctor' | 'personal' | 'work';
  color: string;
  notes?: string;
}

interface GraphQLAppointment {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  color: string;
  notes?: string;
}

interface AppointmentsData {
  appointments: GraphQLAppointment[];
}

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Fetch appointments
  const { loading, error, data, refetch } = useQuery<AppointmentsData>(GET_APPOINTMENTS);

  // Create appointment mutation
  const [createAppointment] = useMutation(CREATE_APPOINTMENT_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setEditingAppointment(null);
    },
    onError: (error) => {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment: ' + error.message);
    },
  });

  // Update appointment mutation
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setEditingAppointment(null);
    },
    onError: (error) => {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment: ' + error.message);
    },
  });

  // Delete appointment mutation
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment: ' + error.message);
    },
  });

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (editingAppointment) {
      // Update existing appointment
      updateAppointment({
        variables: {
          id: parseInt(editingAppointment.id),
          appointmentInput: {
            title: appointmentData.title,
            date: appointmentData.date.toISOString(),
            time: appointmentData.time,
            type: appointmentData.type,
            color: appointmentData.color,
            notes: appointmentData.notes || null,
          },
        },
      });
    } else {
      // Create new appointment
      createAppointment({
        variables: {
          appointmentInput: {
            title: appointmentData.title,
            date: appointmentData.date.toISOString(),
            time: appointmentData.time,
            type: appointmentData.type,
            color: appointmentData.color,
            notes: appointmentData.notes || null,
          },
        },
      });
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment({
        variables: {
          id: parseInt(id),
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading appointments</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Convert GraphQL data to component format
  const appointments: Appointment[] = data?.appointments.map(apt => ({
    id: String(apt.id),
    title: apt.title,
    date: new Date(apt.date),
    time: apt.time,
    type: apt.type as 'meeting' | 'doctor' | 'personal' | 'work',
    color: apt.color,
    notes: apt.notes,
  })) || [];

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Separate upcoming and past appointments
  const now = new Date();
  const upcomingAppointments = sortedAppointments.filter(apt => apt.date >= now);
  const pastAppointments = sortedAppointments.filter(apt => apt.date < now);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          {/* New Appointment Button */}
          <button
            onClick={() => {
              setEditingAppointment(null);
              setIsModalOpen(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Appointment
          </button>
        </div>
      </div>

      {/* Calendar/List View */}
      {view === 'calendar' ? (
        <BigCalendar appointments={appointments} />
      ) : (
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentListItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={() => handleEditAppointment(appointment)}
                    onDelete={() => handleDeleteAppointment(appointment.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past</h2>
              <div className="space-y-3 opacity-60">
                {pastAppointments.map((appointment) => (
                  <AppointmentListItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={() => handleEditAppointment(appointment)}
                    onDelete={() => handleDeleteAppointment(appointment.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
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