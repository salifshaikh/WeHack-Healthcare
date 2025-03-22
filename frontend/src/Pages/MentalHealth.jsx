const MentalHealth = () => {
  // Simulated state management
  const userLocation = "United States"; // Would be determined dynamically
  
  // Crisis helpline data based on location
  const helplinesByLocation = {
    "United States": [
      { name: "National Suicide Prevention Lifeline", number: "988", icon: "🆘" },
      { name: "Crisis Text Line", number: "Text HOME to 741741", icon: "💬" },
      { name: "Veterans Crisis Line", number: "1-800-273-8255", icon: "🎖️" },
      { name: "Veterans Crisis Line", number: "1-800-273-8255", icon: "🎖️" },
    ],
    "Canada": [
      { name: "Canada Suicide Prevention Service", number: "1-833-456-4566", icon: "🆘" },
      { name: "Crisis Services Canada", number: "1-833-456-4566", icon: "💬" }
    ],
    // More countries would be added
  };
  
  // Get helplines for user's location
  const localHelplines = helplinesByLocation[userLocation] || helplinesByLocation["United States"];
  
  // Therapist data
  const therapists = [
    {
      name: "Dr. Sarah Johnson",
      specialization: "Anxiety & Depression",
      rating: 4.9,
      image: "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg",
      available: true,
      price: "$60",
      ngoPartner: true
    },
    {
      name: "Dr. Michael Chen",
      specialization: "Trauma & PTSD",
      rating: 4.8,
      image: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
      available: true,
      price: "$75",
      ngoPartner: false
    },
    {
      name: "Dr. Aisha Patel",
      specialization: "Relationship Counseling",
      rating: 4.7,
      image: "https://www.shutterstock.com/image-photo/profile-photo-attractive-family-doc-600nw-1724693776.jpg",
      available: false,
      price: "$50",
      ngoPartner: true
    },
    {
      name: "Dr. HansRaj Hathi",
      specialization: "Work Stress & Burnout",
      rating: 4.9,
      image: "https://static.toiimg.com/thumb/msid-64917056,width-400,resizemode-4/64917056.jpg",
      available: true,
      price: "$65",
      ngoPartner: false
    }
  ];
  
  // Meditation content
  const meditationContent = [
    {
      title: "Morning Clarity",
      duration: "10 min",
      category: "Mindfulness",
      level: "Beginner",
      image: "/images/meditation1.jpg",
      popular: true
    },
    {
      title: "Anxiety Relief",
      duration: "15 min",
      category: "Stress Management",
      level: "Intermediate",
      image: "/images/meditation2.jpg",
      popular: true
    },
    {
      title: "Deep Sleep Guide",
      duration: "20 min",
      category: "Sleep",
      level: "All Levels",
      image: "/images/meditation3.jpg",
      popular: false
    },
    {
      title: "Focus Enhancer",
      duration: "8 min",
      category: "Productivity",
      level: "Beginner",
      image: "/images/meditation4.jpg",
      popular: false
    },
    {
      title: "Emotional Balance",
      duration: "12 min",
      category: "Emotional Healing",
      level: "Intermediate",
      image: "/images/meditation5.jpg",
      popular: true
    },
    {
      title: "5-Minute Breathing",
      duration: "5 min",
      category: "Quick Relief",
      level: "All Levels",
      image: "/images/meditation6.jpg",
      popular: true
    }
  ];
  
  // Daily challenges
  const dailyChallenges = [
    {
      title: "Gratitude Journal",
      description: "Write down 3 things you're grateful for today",
      points: 50,
      icon: "📔",
      completed: false
    },
    {
      title: "Deep Breathing",
      description: "Practice 4-7-8 breathing technique for 5 minutes",
      points: 30,
      icon: "🫁",
      completed: true
    },
    {
      title: "Digital Detox",
      description: "Take a 2-hour break from all screens",
      points: 80,
      icon: "📵",
      completed: false
    },
    {
      title: "Kindness Act",
      description: "Do something nice for someone without expecting anything in return",
      points: 60,
      icon: "💝",
      completed: false
    }
  ];
  
  // Function to simulate call action
  const handleEmergencyCall = (number) => {
    console.log(`Calling ${number}...`);
    // In production this would use tel: protocol 
  };
  
  // Function to book a session
  const bookSession = (therapist) => {
    console.log(`Booking session with ${therapist.name}`);
    // In production would open booking modal/page
  };
  
  return (
    <div className="min-h-screen bg-[#0a0b1d] text-white">
      {/* Hero Section with Floating Particles Background */}
      <div className="relative overflow-hidden">
        {/* Floating particles effect - decorative divs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-between relative z-10">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Your Mental Wellbeing Journey
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Taking care of your mental health is as important as physical health. 
              Explore our resources, connect with professionals, and begin your path to wellness.
            </p>
            <div className="inline-flex p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <button className="px-8 py-3 rounded-full bg-[#131438] hover:bg-[#1a1b3a] transition-all text-xl font-medium">
                Take Mental Health Assessment
              </button>
            </div>
          </div>
          
          <div className="mt-10 w-full max-w-4xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-[#13142d]/60 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-semibold">Crisis Support - Get Help Now</h2>
              </div>
              <p className="text-gray-300 mb-4">
                If you're experiencing a mental health crisis or having thoughts of suicide, 
                please reach out immediately. Help is available 24/7.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localHelplines.map((helpline, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmergencyCall(helpline.number)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-red-900/50 to-red-700/50 hover:from-red-800 hover:to-red-600 p-4 rounded-lg border border-red-500/30 group transition-all"
                  >
                    <span className="text-2xl">{helpline.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{helpline.name}</p>
                      <p className="text-red-300">{helpline.number}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-500 group-hover:bg-red-400 flex items-center justify-center transition-all">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Counseling Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="inline-block text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              On-Demand Video Counseling
            </h2>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Connect with licensed therapists from the comfort of your home. Book a session that 
              fits your schedule and needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {therapists.map((therapist, index) => (
              <div 
                key={index} 
                className="bg-[#13142d]/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:translate-y-[-4px] transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <img 
                    src={therapist.image} 
                    alt={therapist.name} 
                    className="w-full h-48 object-cover"
                  />
                  {therapist.available && (
                    <span className="absolute top-3 right-3 flex items-center px-2 py-1 rounded-full bg-green-900/70 text-green-300 text-xs font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      Available Now
                    </span>
                  )}
                  {therapist.ngoPartner && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-blue-800/70 text-blue-300 text-xs font-medium">
                      NGO Partner • Reduced Cost
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-xl font-semibold">{therapist.name}</h3>
                    <p className="text-blue-300">{therapist.specialization}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 font-medium">{therapist.rating}</span>
                    </div>
                    <span className="text-lg font-semibold text-purple-300">{therapist.price}/session</span>
                  </div>
                  <button 
                    onClick={() => bookSession(therapist)}
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      therapist.available 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400' 
                        : 'bg-[#1a1b3a] text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!therapist.available}
                  >
                    {therapist.available ? 'Book Session' : 'Currently Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <button className="px-6 py-3 rounded-lg bg-[#1a1b3a] hover:bg-[#222356] border border-blue-500/30 transition-all">
              View All Therapists
            </button>
          </div>
        </div>
      </section>
      
      {/* Meditation Library Section */}
      <section className="py-16 bg-[#0d0e24]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="inline-block text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Meditation & Breathing Exercises
            </h2>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Discover guided meditations, breathing techniques, and mindfulness practices designed to reduce stress and improve mental clarity.
            </p>
          </div>
          
          <div className="flex space-x-4 mb-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
            <button className="px-4 py-2 bg-blue-500 rounded-full whitespace-nowrap">All</button>
            <button className="px-4 py-2 bg-[#1a1b3a] hover:bg-[#222356] rounded-full whitespace-nowrap transition-all">Stress Relief</button>
            <button className="px-4 py-2 bg-[#1a1b3a] hover:bg-[#222356] rounded-full whitespace-nowrap transition-all">Sleep</button>
            <button className="px-4 py-2 bg-[#1a1b3a] hover:bg-[#222356] rounded-full whitespace-nowrap transition-all">Anxiety</button>
            <button className="px-4 py-2 bg-[#1a1b3a] hover:bg-[#222356] rounded-full whitespace-nowrap transition-all">Focus</button>
            <button className="px-4 py-2 bg-[#1a1b3a] hover:bg-[#222356] rounded-full whitespace-nowrap transition-all">Beginners</button>
            <button className="px-4 py-2 bg-[#1a1b3a] hover:bg-[#222356] rounded-full whitespace-nowrap transition-all">Breathing</button>
            <button className="px-4 py-2 bg-[#1a1b3a] hover:bg-[#222356] rounded-full whitespace-nowrap transition-all">Quick Relief</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationContent.map((item, index) => (
              <div 
                key={index}
                className="group relative rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 z-10"></div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {item.popular && (
                  <span className="absolute top-4 right-4 z-20 bg-blue-500 text-xs font-bold px-2 py-1 rounded">
                    POPULAR
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-300">
                      {item.category}
                    </span>
                    <span className="text-sm text-blue-300">
                      {item.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.level}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                      + Add to Playlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-[#131438] rounded-xl p-6 border border-blue-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">Breathing Exercise of the Day</h3>
                <h4 className="text-xl text-blue-300 mb-4">4-7-8 Technique for Anxiety Relief</h4>
                <p className="text-gray-300">
                  This simple technique acts as a natural tranquilizer for your nervous system. Practice it twice daily to reduce anxiety and improve sleep quality.
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <button className="px-5 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Start Exercise
                  </button>
                  <button className="px-5 py-2 bg-transparent hover:bg-[#1a1b3a] border border-blue-500 rounded-lg transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-[#1a1b3a]" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                    <circle className="text-blue-500 animate-breathe" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" strokeDasharray="264, 264" strokeDashoffset="120" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">Breathe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default MentalHealth;