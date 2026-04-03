import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    // TODO: upload file to backend
  };

  const [form, setForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 000-0000',
    location: 'New York, NY',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: save to backend
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* Left panel — user card */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm p-5 flex flex-col items-center text-center">
          <div className={`relative group mt-3 ${avatarUrl ? 'w-28 h-28' : 'w-20 h-20'} transition-all duration-300`}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold select-none">
                JD
              </div>
            )}
            <button
              onClick={handlePhotoClick}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Change photo"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <h2 className="mt-3 text-base font-semibold text-gray-900">
            {form.firstName} {form.lastName}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{form.email}</p>
          <p className="text-xs text-gray-400 mt-2">Member since January 2024</p>

          <button
            onClick={handlePhotoClick}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary border border-primary/40 rounded-lg px-4 py-1.5 hover:bg-secondary/40 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            Edit Photo
          </button>
        </div>

        {/* Right panel */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Personal Information
            </h3>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-primary text-white text-sm px-5 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Account */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Account
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Plan</p>
                <p className="text-xs text-gray-400 mt-0.5">You are currently on the Free plan.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Free</span>
                <Link
                  to="/upgrade"
                  className="text-xs font-semibold bg-primary text-white px-3 py-1 rounded-full hover:bg-primary-dark transition-colors"
                >
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
