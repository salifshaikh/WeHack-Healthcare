import React, { useState } from "react";

const BookSession = ({ doctor = {}, onClose }) => {
  // Use only necessary state variables
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [symptoms, setSymptoms] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // Generate available dates
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      dates.push({
        full: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        day: date.toLocaleDateString('en-US', { day: 'numeric' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        value: date.toISOString().split('T')[0],
      });
    }
    return dates;
  };

  // Available times
  const availableTimes = doctor?.availability || ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:00 PM'];

  // Show notification
  const showNotificationAlert = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

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
      
      setAppointmentDetails({
        doctorName: doctor.name || 'Dr. Emily Johnson',
        doctorSpecialty: doctor.specialty || 'Psychiatrist',
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        reference: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      
      showNotificationAlert('success', 'Appointment booked successfully!');
    }, 1500);
  };

  // Navigation functions
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

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full bg-blue-600/10 blur-3xl top-1/4 -left-32 animate-pulse"></div>
        <div className="absolute w-96 h-96 rounded-full bg-purple-600/10 blur-3xl bottom-1/4 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl top-3/4 left-1/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0d0e24] to-[#131438] rounded-2xl shadow-2xl border border-gray-700/50">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-b-2xl pointer-events-none"></div>
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 w-8 h-8 rounded-full bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-all duration-200"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Notification */}
        {notification.show && (
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center ${
            notification.type === 'success' ? 'bg-gradient-to-r from-green-600 to-green-800' : 'bg-gradient-to-r from-red-600 to-red-800'
          }`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} mr-2`}>
              {notification.type === 'success' ? (
                <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <span className="text-white font-medium">{notification.message}</span>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-8 md:px-8 relative z-10">
          {!bookingComplete ? (
            <>
              {/* Progress steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((stepNum) => (
                    <div key={stepNum} className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        step >= stepNum 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20' 
                          : 'bg-gray-700'
                      } mb-2 transition-all duration-300`}>
                        {step > stepNum ? (
                          <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-white font-semibold">{stepNum}</span>
                        )}
                      </div>
                      <span className={`text-sm ${step >= stepNum ? 'text-blue-400' : 'text-gray-400'}`}>
                        {stepNum === 1 ? 'Schedule' : stepNum === 2 ? 'Details' : 'Confirm'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative h-2 mt-4 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" 
                    style={{ 
                      width: `${((step - 1) / 2) * 100}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>

              {/* Doctor info */}
              <div className="bg-[#1a1b3a]/80 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 shadow-lg shadow-blue-900/10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-800 to-indigo-900 mr-4 border-2 border-blue-400/20">
                  {doctor?.image ? (
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
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
                        <svg key={star} className={`w-4 h-4 ${star <= Math.round(doctor?.rating || 5) ? 'text-yellow-400' : 'text-gray-600'}`}
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-2">{doctor?.rating || '4.9'} ({doctor?.reviews || '124'} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Step 1 - Schedule */}
              {step === 1 && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Select Date & Time</h2>

                  {/* Date selection */}
                  <div className="mb-8">
                    <label className="block text-lg font-medium text-blue-300 mb-3">Available Dates</label>
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                      {getAvailableDates().map((date, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date.value)}
                          className={`p-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                            selectedDate === date.value
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-700/20'
                              : 'bg-[#1a1b3a]/80 hover:bg-[#232456] text-gray-300 border border-gray-700/30 hover:border-blue-500/30'
                          }`}
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
                    <label className="block text-lg font-medium text-blue-300 mb-3">Available Times</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {availableTimes.map((time, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-700/20'
                              : 'bg-[#1a1b3a]/80 hover:bg-[#232456] text-gray-300 border border-gray-700/30 hover:border-blue-500/30'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Appointment type */}
                  <div className="mb-8">
                    <label className="block text-lg font-medium text-blue-300 mb-3">Appointment Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'video', label: 'Video Call', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                        { id: 'audio', label: 'Audio Call', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                        { id: 'inperson', label: 'In-Person', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setAppointmentType(type.id)}
                          className={`p-4 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105 ${
                            appointmentType === type.id
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-indigo-700/20'
                              : 'bg-[#1a1b3a]/80 hover:bg-[#232456] text-gray-300 border border-gray-700/30 hover:border-blue-500/30'
                          }`}
                        >
                          <span className={`w-10 h-10 mr-3 flex items-center justify-center rounded-full ${
                            appointmentType === type.id 
                              ? 'bg-white/10' 
                              : 'bg-blue-500/20'
                          }`}>
                            <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                            </svg>
                          </span>
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Appointment Details */}
              {step === 2 && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Appointment Details</h2>

                  <div className="space-y-6">
                    {/* Symptoms/Reason */}
                    <div>
                      <label className="block text-lg font-medium text-blue-300 mb-2">What symptoms are you experiencing?</label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="w-full bg-[#1a1b3a]/80 text-gray-200 rounded-lg border border-gray-700/50 p-4 h-32 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Please describe your symptoms or reason for visit..."
                      ></textarea>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-lg font-medium text-blue-300 mb-2">Additional Notes (Optional)</label>
                      <textarea
                        value={appointmentNotes}
                        onChange={(e) => setAppointmentNotes(e.target.value)}
                        className="w-full bg-[#1a1b3a]/80 text-gray-200 rounded-lg border border-gray-700/50 p-4 h-24 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Any additional information you'd like the doctor to know..."
                      ></textarea>
                    </div>

                    {/* Privacy notice */}
                    <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-900/50 backdrop-blur-sm">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
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
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Confirm Your Appointment</h2>

                  {/* Appointment Summary */}
                  <div className="bg-[#1a1b3a]/80 rounded-xl p-6 mb-6 border border-gray-700/50 shadow-lg backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-4">Appointment Summary</h3>

                    {/* Doctor Details */}
                    <div className="flex items-center space-x-4 mb-4">
                      {doctor?.image ? (
                        <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20" />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-blue-200 text-xl font-bold border-2 border-blue-500/20">
                          {doctor?.name?.charAt(0) || 'D'}
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-medium text-white">{doctor?.name || 'Dr. Emily Johnson'}</p>
                        <p className="text-sm text-gray-300">{doctor?.specialty || 'Psychiatrist'}</p>
                      </div>
                    </div>

                    {/* Appointment Date & Time */}
                    <div className="space-y-2 divide-y divide-gray-700/30">
                      <div className="flex justify-between py-2">
                        <p className="text-gray-300">Date:</p>
                        <p className="text-white font-medium">{selectedDate}</p>
                      </div>
                      <div className="flex justify-between py-2">
                        <p className="text-gray-300">Time:</p>
                        <p className="text-white font-medium">{selectedTime}</p>
                      </div>
                      <div className="flex justify-between py-2">
                        <p className="text-gray-300">Type:</p>
                        <p className="text-white font-medium">{appointmentType === 'video' ? 'Video Call' : appointmentType === 'audio' ? 'Audio Call' : 'In-Person'}</p>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mt-4 pt-2 border-t border-gray-700/30">
                      <p className="text-gray-300 mb-2 font-medium">Symptoms:</p>
                      <p className="text-white bg-[#232456]/50 p-3 rounded-lg">{symptoms || 'None provided'}</p>
                    </div>

                    {/* Additional Notes */}
                    {appointmentNotes && (
                      <div className="mt-4 pt-2 border-t border-gray-700/30">
                        <p className="text-gray-300 mb-2 font-medium">Additional Notes:</p>
                        <p className="text-white bg-[#232456]/50 p-3 rounded-lg">{appointmentNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 rounded-lg text-white font-medium border border-gray-600/30 hover:border-gray-500/30 transition-all duration-200 backdrop-blur-sm"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>  
                )}
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white font-medium flex items-center transition-all duration-200 shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : step < 3 ? 'Continue' : 'Confirm Appointment'}
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Appointment Booked Successfully!</h2>
              <div className="bg-[#1a1b3a]/80 rounded-xl p-6 border border-gray-700/50 shadow-lg backdrop-blur-sm relative overflow-hidden">
                {/* Success confetti animation */}
                <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                  <div className="absolute -left-10 -top-10 w-20 h-20 rounded-full bg-green-500 blur-xl"></div>
                  <div className="absolute -right-10 -bottom-10 w-20 h-20 rounded-full bg-blue-500 blur-xl"></div>
                  <div className="absolute left-1/2 top-0 w-20 h-20 rounded-full bg-purple-500 blur-xl"></div>
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-gray-300 text-lg">
                  Your appointment with {doctor?.name || 'Dr. Emily Johnson'} on {selectedDate} at {selectedTime} has been confirmed.
                </p>
                <p className="text-center text-gray-300 mt-2">
                  You will receive a confirmation email shortly.
                </p>
                <div className="flex items-center justify-center bg-blue-900/20 mt-6 p-4 rounded-lg border border-blue-900/30">
                  <div className="mr-3 text-blue-400">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-blue-400">Reference Code:</span> {appointmentDetails?.reference}
                  </p>
                </div>
                
                {appointmentType === 'video' && (
                  <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg border border-emerald-900/30">
                    <p className="text-center text-gray-300 font-medium">
                      Video link will be sent to your email 15 minutes before the appointment.
                    </p>
                  </div>
                )}
                
                <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-200 shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 transform hover:scale-105"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-200 shadow-lg shadow-purple-700/20 hover:shadow-purple-700/30 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSession;
                