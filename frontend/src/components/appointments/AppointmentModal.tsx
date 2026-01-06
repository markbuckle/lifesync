import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Appointment } from '../../sampleData';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  editingAppointment?: Appointment | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAppointment,
}) => {
  const [formData, setFormData] = useState({
    title: editingAppointment?.title || '',
    date: editingAppointment?.date
      ? editingAppointment.date.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    time: editingAppointment?.time || '09:00 AM',
    type: editingAppointment?.type || 'meeting',
    notes: '',
  });

  const typeColors: Record<string, string> = {
    meeting: '#3B82F6',
    doctor: '#10B981',
    personal: '#8B5CF6',
    work: '#B85C38',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAppointment: Omit<Appointment, 'id'> = {
      title: formData.title,
      date: new Date(formData.date),
      time: formData.time,
      type: formData.type as 'meeting' | 'doctor' | 'personal' | 'work',
      color: typeColors[formData.type],
    };

    onSave(newAppointment);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM',
      type: 'meeting',
      notes: '',
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingAppointment ? 'Edit Appointment' : 'New Appointment'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Team meeting"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="9:00 AM"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="meeting">Meeting</option>
            <option value="doctor">Doctor</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
          </select>
        </div>

        {/* Notes (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Add any additional details..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {editingAppointment ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;