import React from 'react';

const AppointmentsPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          + New Appointment
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-600">No appointments yet. Create your first one!</p>
      </div>
    </div>
  );
};

export default AppointmentsPage;