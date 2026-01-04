import React from 'react';
import BigCalendar from '../../components/calendar/BigCalendar';
import { sampleAppointments } from '../../sampleData';

const CalendarPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Calendar</h1>
      <BigCalendar appointments={sampleAppointments} />
    </div>
  );
};

export default CalendarPage;