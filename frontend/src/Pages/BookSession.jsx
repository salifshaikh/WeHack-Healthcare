import React from "react";
import { useState } from "react";

const BookSession = ({ doctor, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('video');
    const [symptoms, setSymptoms] = useState('');
    const [appointmentNotes, setAppointmentNotes] = useState('');
    const [bookingComplete, setBookingComplete] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
  
    // Get available dates (next 7 days)
    const getAvailableDates = () => {
      const dates = [];
      const today = new Date();
  
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
  
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
  
        dates.push({
          full: formattedDate,
          day: date.toLocaleDateString('en-US', { day: 'numeric' }),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          value: date.toISOString().split('T')[0],
        });
      }
  
      return dates;
    };
  
    // Available times
    const availableTimes = doctor?.availability || [
      '9:00 AM',
      '10:30 AM',
      '1:00 PM',
      '3:30 PM',
      '5:00 PM',
    ];
  
    // Handle form submission
    const handleSubmit = () => {
      if (!selectedDate || !selectedTime) {
        showNotificationAlert('error', 'Please select both date and time');
        return;
      }
  
      setLoading(true);
  
      // Simulate API request
      setTimeout(() => {
        setLoading(false);
        setBookingComplete(true);
  
        // Create appointment details
        const details = {
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          date: selectedDate,
          time: selectedTime,
          type: appointmentType,
          reference: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
        };
  
        setAppointmentDetails(details);
        showNotificationAlert('success', 'Appointment booked successfully!');
      }, 1500);
    };
  
    // Show notification
    const showNotificationAlert = (type, message) => {
      setNotificationType(type);
      setNotificationMessage(message);
      setShowNotification(true);
  
      // Hide after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };
  
    // Handle going to next step
    const handleNextStep = () => {
      if (step === 1 && (!selectedDate || !selectedTime)) {
        showNotificationAlert('error', 'Please select both date and time');
        return;
      }
  
      if (step < 3) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    };
  
    // Handle going back to previous step
    const handlePrevStep = () => {
      if (step > 1) {
        setStep(step - 1);
        window.scrollTo(0, 0);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0d0e24] to-[#131438] rounded-2xl shadow-2xl border border-gray-700/50"
          style={{
            opacity: 0,
            animation: 'fadeInUp 0.5s ease forwards',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
  
          {/* Notification */}
          {showNotification && (
            <div
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center ${
                notificationType === 'success'
                  ? 'bg-gradient-to-r from-green-600 to-green-800'
                  : 'bg-gradient-to-r from-red-600 to-red-800'
              }`}
              style={{
                opacity: 0,
                animation: 'fadeInDown 0.5s ease forwards, fadeOut 0.5s ease 4.5s forwards',
              }}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
                } mr-2`}
              >
                {notificationType === 'success' ? (
                  <svg
                    className="w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </span>
              <span className="text-white font-medium">{notificationMessage}</span>
            </div>
          )}
  
          {/* Content */}
          <div className="px-6 py-8 md:px-8">
            {!bookingComplete ? (
              <>
                {/* Progress steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((stepNum) => (
                      <div key={stepNum} className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            step >= stepNum
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                              : 'bg-gray-700'
                          } mb-2`}
                          style={{
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {step > stepNum ? (
                            <svg
                              className="w-5 h-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-white font-semibold">{stepNum}</span>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            step >= stepNum ? 'text-blue-400' : 'text-gray-400'
                          }`}
                        >
                          {stepNum === 1 ? 'Schedule' : stepNum === 2 ? 'Details' : 'Confirm'}
                        </span>
                      </div>
                    ))}
                  </div>
  
                  <div className="relative h-2 mt-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{
                        width: `${((step - 1) / 2) * 100}%`,
                        transition: 'width 0.5s ease',
                      }}
                    ></div>
                  </div>
                </div>
  
                {/* Doctor info - always visible */}
                <div
                  className="bg-[#1a1b3a] rounded-xl p-4 mb-6 flex items-center border border-gray-700/50"
                  style={{
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease 0.3s forwards',
                  }}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700 mr-4">
                    {doctor?.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-900 text-blue-300 text-xl font-bold">
                        {doctor?.name?.charAt(0) || 'D'}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1b3a]"></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{doctor?.name || 'Dr. Emily Johnson'}</h3>
                    <p className="text-blue-300">{doctor?.specialty || 'Psychiatrist'}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(doctor?.rating || 5) ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-2">
                        {doctor?.rating || '4.9'} ({doctor?.reviews || '124'} reviews)
                      </span>
                    </div>
                  </div>
                </div>
  
                {/* Step 1 - Schedule */}
                {step === 1 && (
                  <div
                    style={{
                      opacity: 0,
                      animation: 'fadeIn 0.5s ease 0.2s forwards',
                    }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Select Date & Time</h2>
  
                    {/* Date selection */}
                    <div className="mb-8">
                      <label className="block text-lg font-medium text-blue-300 mb-3">
                        Available Dates
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                        {getAvailableDates().map((date, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(date.value)}
                            className={`p-3 rounded-lg text-center transition-all ${
                              selectedDate === date.value
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-[#1a1b3a] hover:bg-[#232456] text-gray-300'
                            }`}
                            style={{
                              opacity: 0,
                              animation: `fadeInUp 0.3s ease ${0.2 + index * 0.05}s forwards`,
                              boxShadow:
                                selectedDate === date.value ? '0 0 20px rgba(104, 110, 255, 0.4)' : 'none',
                            }}
                          >
                            <div className="text-sm font-medium mb-1">{date.weekday}</div>
                            <div className="text-lg font-bold mb-1">{date.day}</div>
                            <div className="text-xs">{date.month}</div>
                          </button>
                        ))}
                      </div>
                    </div>
  
                    {/* Time selection */}
                    <div className="mb-8">
                      <label className="block text-lg font-medium text-blue-300 mb-3">
                        Available Times
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {availableTimes.map((time, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-lg text-center transition-all ${
                              selectedTime === time
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-[#1a1b3a] hover:bg-[#232456] text-gray-300'
                            }`}
                            style={{
                              opacity: 0,
                              animation: `fadeInUp 0.3s ease ${0.5 + index * 0.05}s forwards`,
                              boxShadow:
                                selectedTime === time ? '0 0 20px rgba(104, 110, 255, 0.4)' : 'none',
                            }}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
  
                    {/* Appointment type */}
                    <div className="mb-8">
                      <label className="block text-lg font-medium text-blue-300 mb-3">
                        Appointment Type
                      </label>
                      <div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        style={{
                          opacity: 0,
                          animation: 'fadeInUp 0.5s ease 0.7s forwards',
                        }}
                      >
                        <button
                          onClick={() => setAppointmentType('video')}
                          className={`p-4 rounded-lg flex items-center transition-all ${
                            appointmentType === 'video'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-[#1a1b3a] hover:bg-[#232456] text-gray-300'
                          }`}
                        >
                          <span className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-blue-500/20">
                            <svg
                              className="w-5 h-5 text-blue-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                          <span>Video Call</span>
                        </button>
  
                        <button
                          onClick={() => setAppointmentType('audio')}
                          className={`p-4 rounded-lg flex items-center transition-all ${
                            appointmentType === 'audio'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-[#1a1b3a] hover:bg-[#232456] text-gray-300'
                          }`}
                        >
                          <span className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-blue-500/20">
                            <svg
                              className="w-5 h-5 text-blue-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </span>
                          <span>Audio Call</span>
                        </button>
  
                        <button
                          onClick={() => setAppointmentType('inperson')}
                          className={`p-4 rounded-lg flex items-center transition-all ${
                            appointmentType === 'inperson'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-[#1a1b3a] hover:bg-[#232456] text-gray-300'
                          }`}
                        >
                          <span className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-blue-500/20">
                            <svg
                              className="w-5 h-5 text-blue-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </span>
                          <span>In-Person</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
  
                {/* Step 2 - Appointment Details */}
                {step === 2 && (
                  <div
                    style={{
                      opacity: 0,
                      animation: 'fadeIn 0.5s ease forwards',
                    }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Appointment Details</h2>
  
                    <div className="space-y-6">
                      {/* Symptoms/Reason */}
                      <div
                        style={{
                          opacity: 0,
                          animation: 'fadeInUp 0.5s ease 0.2s forwards',
                        }}
                      >
                        <label className="block text-lg font-medium text-blue-300 mb-2">
                          What symptoms are you experiencing?
                        </label>
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="w-full bg-[#1a1b3a] text-gray-200 rounded-lg border border-gray-700 p-4 h-32 focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="Please describe your symptoms or reason for visit..."
                        ></textarea>
                      </div>
  
                      {/* Additional Notes */}
                      <div
                        style={{
                          opacity: 0,
                          animation: 'fadeInUp 0.5s ease 0.4s forwards',
                        }}
                      >
                        <label className="block text-lg font-medium text-blue-300 mb-2">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          value={appointmentNotes}
                          onChange={(e) => setAppointmentNotes(e.target.value)}
                          className="w-full bg-[#1a1b3a] text-gray-200 rounded-lg border border-gray-700 p-4 h-24 focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="Any additional information you'd like the doctor to know..."
                        ></textarea>
                      </div>
  
                      {/* Privacy notice */}
                      <div
                        className="p-4 bg-blue-900/20 rounded-lg border border-blue-900/50"
                        style={{
                          opacity: 0,
                          animation: 'fadeInUp 0.5s ease 0.6s forwards',
                        }}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              className="w-5 h-5 text-blue-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="ml-3 text-sm text-gray-300">
                            Your health information is protected by our privacy policy. We only share
                            this information with your doctor and healthcare team.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
  
                {/* Step 3 - Confirmation */}
                {step === 3 && (
                  <div
                    style={{
                      opacity: 0,
                      animation: 'fadeIn 0.5s ease forwards',
                    }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Confirm Your Appointment</h2>
  
                    {/* Appointment Summary */}
                    <div
                      className="bg-[#1a1b3a] rounded-xl p-6 mb-6 border border-gray-700/50"
                      style={{
                        opacity: 0,
                        animation: 'fadeInUp 0.5s ease 0.2s forwards',
                      }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">Appointment Summary</h3>
  
                      {/* Doctor Details */}
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-lg font-medium text-white">{doctor.name}</p>
                          <p className="text-sm text-gray-300">{doctor.specialty}</p>
                        </div>
                      </div>
  
                      {/* Appointment Date & Time */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-gray-300">Date:</p>
                          <p className="text-white">{selectedDate}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-300">Time:</p>
                          <p className="text-white">{selectedTime}</p>
                        </div>
                      </div>
  
                      {/* Symptoms */}
                      <div className="mt-4">
                        <p className="text-gray-300 mb-2">Symptoms:</p>
                        <p className="text-white">{symptoms}</p>
                      </div>
  
                      {/* Additional Notes */}
                      {appointmentNotes && (
                        <div className="mt-4">
                          <p className="text-gray-300 mb-2">Additional Notes:</p>
                          <p className="text-white">{appointmentNotes}</p>
                        </div>
                      )}
                    </div>
  
                    {/* Privacy Notice */}
                    <div
                      className="p-4 bg-blue-900/20 rounded-lg border border-blue-900/50 mb-6"
                      style={{
                        opacity: 0,
                        animation: 'fadeInUp 0.5s ease 0.4s forwards',
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            className="w-5 h-5 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-300">
                          Your health information is protected by our privacy policy. We only share
                          this information with your doctor and healthcare team.
                        </p>
                      </div>
                    </div>
  
                    {/* Confirmation Buttons */}
                    <div
                      className="flex justify-between"
                      style={{
                        opacity: 0,
                        animation: 'fadeInUp 0.5s ease 0.6s forwards',
                      }}
                    >
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all"
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease forwards',
                }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Appointment Booked Successfully!</h2>
                <div className="bg-[#1a1b3a] rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-gray-300">
                    Your appointment with {doctor.name} on {selectedDate} at {selectedTime} has been
                    confirmed.
                  </p>
                  <p className="text-center text-gray-300 mt-2">
                    You will receive a confirmation email shortly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default BookSession;