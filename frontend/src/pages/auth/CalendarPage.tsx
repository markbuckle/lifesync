// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
// import { GET_APPOINTMENTS } from '../../graphql/queries';
// import {
//   CREATE_APPOINTMENT_MUTATION,
//   UPDATE_APPOINTMENT_MUTATION,
//   DELETE_APPOINTMENT_MUTATION
// } from '../../graphql/mutations';
import BigCalendar from '../../components/calendar/BigCalendar';
import AppointmentListItem from '../../components/appointments/AppointmentListItem';
import GoogleEventListItem from '../../components/appointments/GoogleEventListItem';
import AppointmentModal from '../../components/appointments/AppointmentModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, List, CalendarDays } from 'lucide-react';
import {
  GET_APPOINTMENTS,
  GET_CALENDAR_CONNECTION,
  GET_GOOGLE_CALENDAR_EVENTS,
} from '../../graphql/queries';
import {
  CREATE_APPOINTMENT_MUTATION,
  UPDATE_APPOINTMENT_MUTATION,
  DELETE_APPOINTMENT_MUTATION,
  DISCONNECT_CALENDAR_MUTATION,
} from '../../graphql/mutations';

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

interface CalendarConnectionData {
  calendarConnection: {
    connected: boolean;
    email: string | null;
    syncedEvents: number | null;
  };
}

interface GoogleCalendarEventsData {
  googleCalendarEvents: Array<{
    id: string;
    title: string;
    start: string;
    allDay: boolean;
    color: string;
  }>;
}

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Real Google Calendar connection status
  const { data: calendarConnectionData, loading: calendarLoading, refetch: refetchConnection } = useQuery<CalendarConnectionData>(GET_CALENDAR_CONNECTION);
  const calendarConnection = calendarConnectionData?.calendarConnection;

  // Fetch Google Calendar events only when connected
  const { data: googleEventsData } = useQuery<GoogleCalendarEventsData>(GET_GOOGLE_CALENDAR_EVENTS, {
    skip: !calendarConnection?.connected,
  });
  const googleEvents = googleEventsData?.googleCalendarEvents || [];

  // Disconnect mutation
  const [disconnectCalendar] = useMutation(DISCONNECT_CALENDAR_MUTATION, {
    onCompleted: () => refetchConnection(),
  });

  // Handle OAuth redirect back from Google
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('calendar_connected') === 'true') {
      refetchConnection();
      navigate('/calendar', { replace: true });
    }
    if (params.get('error')) {
      alert(`Calendar connection failed: ${params.get('error')}`);
      navigate('/calendar', { replace: true });
    }
  }, [location.search, navigate, refetchConnection]);

  const handleConnectGoogle = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    window.location.href = `http://localhost:8000/auth/google/calendar?token=${token}`;
  };

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

  // Merge upcoming Google Calendar events into a unified sorted list
  const upcomingGoogleEvents = googleEvents
    .map((e: { id: string; title: string; start: string; allDay: boolean; color: string }) => ({
      ...e,
      _date: new Date(e.start),
    }))
    .filter((e: { _date: Date }) => e._date >= now)
    .sort((a: { _date: Date }, b: { _date: Date }) => a._date.getTime() - b._date.getTime());

  type UnifiedItem =
    | { kind: 'appointment'; data: Appointment }
    | { kind: 'google'; data: typeof upcomingGoogleEvents[number] };

  const upcomingItems: UnifiedItem[] = [
    ...upcomingAppointments.map(a => ({ kind: 'appointment' as const, data: a, _date: a.date })),
    ...upcomingGoogleEvents.map(e => ({ kind: 'google' as const, data: e, _date: e._date })),
  ].sort((a, b) => a._date.getTime() - b._date.getTime());

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
        <BigCalendar
          appointments={appointments}
          onEdit={handleEditAppointment}
          googleEvents={googleEvents}
        />
      ) : (
        <div className="space-y-6">
          {/* Upcoming Appointments + Google Events */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
            {upcomingItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingItems.map((item) =>
                  item.kind === 'appointment' ? (
                    <AppointmentListItem
                      key={item.data.id}
                      appointment={item.data}
                      onEdit={() => handleEditAppointment(item.data)}
                      onDelete={() => handleDeleteAppointment(item.data.id)}
                    />
                  ) : (
                    <GoogleEventListItem
                      key={item.data.id}
                      id={item.data.id}
                      title={item.data.title}
                      start={item.data.start}
                      allDay={item.data.allDay}
                      color={item.data.color}
                    />
                  )
                )}
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

      {/* Connected Calendars */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h2 className="text-base font-semibold">Connected Calendars</h2>
          </div>
        </div>

        {!calendarConnection?.connected ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4285F4] flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <p className="text-sm text-gray-500">No calendars connected yet</p>
            <button
              onClick={handleConnectGoogle}
              className="bg-primary text-white rounded-full px-5 py-2 text-sm hover:bg-primary-dark transition-colors"
            >
              Connect Google Calendar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0 bg-[#4285F4]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Google Calendar</p>
              <p className="text-sm text-gray-500">{calendarConnection.email}</p>
            </div>
            <button
              onClick={() => setView('list')}
              className="bg-secondary text-primary-dark text-xs rounded-full px-2 py-0.5 hover:brightness-95 transition-all"
            >
              {calendarConnection.syncedEvents} events synced
            </button>
            <button
              onClick={() => disconnectCalendar()}
              className="border border-red-400 text-red-400 rounded-full px-4 py-1.5 text-sm hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">Outlook, Yahoo, and Apple Calendar coming soon.</p>
      </div>

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