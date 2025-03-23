import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for emergency services
const createEmergencyIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ambulanceIcon = createEmergencyIcon('red');
const policeIcon = createEmergencyIcon('blue');
const fireIcon = createEmergencyIcon('orange');

const EmergencyMarker = ({ position, respondingService }) => {
  let icon;
  let serviceLabel;
  
  switch (respondingService) {
    case 'ambulance':
      icon = ambulanceIcon;
      serviceLabel = 'Ambulance';
      break;
    case 'police':
      icon = policeIcon;
      serviceLabel = 'Police';
      break;
    case 'fire':
      icon = fireIcon;
      serviceLabel = 'Fire Brigade';
      break;
    default:
      icon = new L.Icon.Default();
      serviceLabel = 'Emergency';
  }

  return (
    <Marker position={position} icon={icon}>
      <Popup>{serviceLabel} responding</Popup>
    </Marker>
  );
};

// Component to handle map events and center changes
const MapController = ({ userLocation, emergencyResponder }) => {
  const map = useMapEvents({});
  
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 15);
    }
  }, [userLocation, map]);
  
  useEffect(() => {
    if (emergencyResponder && emergencyResponder.isResponding) {
      // Include all relevant markers in bounds
      const bounds = L.latLngBounds([
        [userLocation.latitude, userLocation.longitude],
        [emergencyResponder.position[0], emergencyResponder.position[1]]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [emergencyResponder, userLocation, map]);
  
  return null;
};

const FallDetectionEmergency = () => {
  // Original state variables
  const [isFallDetected, setIsFallDetected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedKeywords, setDetectedKeywords] = useState([]);
  const [networkStatus, setNetworkStatus] = useState('online');
  const [retryCount, setRetryCount] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState({
    motion: false,
    location: false,
    microphone: false
  });
  
  // New state variables for map and emergency response
  const [emergencyResponder, setEmergencyResponder] = useState({
    isResponding: false,
    position: [0, 0],
    service: null,
    arrivalTime: null
  });
  const [showMap, setShowMap] = useState(false);
  
  // Refs
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const synthesisVoicesLoaded = useRef(false);
  const maxRetries = useRef(5);
  const animationFrameRef = useRef(null);
  
  // Code words for different emergency services
  const codeWords = {
    ambulance: ["medical", "ambulance", "hospital", "emergency", "help", "hurt"],
    police: ["police", "security", "officer", "danger", "threat", "attacked"],
    fire: ["fire", "flames", "firefighter", "burning", "smoke", "heat"]
  };

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network is online');
      setNetworkStatus('online');
      setMessage('Internet connection restored');
      // Attempt to restart speech recognition if it was previously active
      if (isFallDetected && !isProcessing) {
        setTimeout(() => startListening(), 1000);
      }
    };
    
    const handleOffline = () => {
      console.log('Network is offline');
      setNetworkStatus('offline');
      setMessage('Internet connection lost. Voice recognition may not work properly.');
      setShowManualInput(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isFallDetected, isProcessing]);

  // Request permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      console.log('Requesting permissions...');
      // Request microphone permission
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getTracks().forEach(track => track.stop());
        setPermissionsGranted(prev => ({ ...prev, microphone: true }));
        console.log('Microphone permission granted');
      } catch (error) {
        console.error('Microphone permission error:', error);
        setMessage('Microphone access denied. Please enable microphone access to use voice recognition.');
      }

      // Check location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionsGranted(prev => ({ ...prev, location: true }));
            console.log('Location permission granted');
          },
          (error) => {
            console.error('Location permission error:', error);
            setMessage('Location access denied. Please enable location services for emergency response.');
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }

      // We can't explicitly request DeviceMotion permission in all browsers,
      // but we can check if it's available
      if ('DeviceMotionEvent' in window) {
        setPermissionsGranted(prev => ({ ...prev, motion: true }));
        console.log('Device motion available');
      }
    };

    requestPermissions();

    // Preload speech synthesis voices
    if ('speechSynthesis' in window) {
      console.log('Loading speech synthesis voices...');
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        synthesisVoicesLoaded.current = true;
        console.log('Speech synthesis voices loaded');
      };
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  
  // Initialize accelerometer for fall detection
  useEffect(() => {
    if (!permissionsGranted.motion) return;
    
    if ('DeviceMotionEvent' in window) {
      console.log('Setting up device motion listener');
      const handleMotion = (event) => {
        const acceleration = event.accelerationIncludingGravity;
        
        // Fall detection algorithm - detects sudden acceleration changes
        if (acceleration) {
          const accelerationMagnitude = Math.sqrt(
            Math.pow(acceleration.x || 0, 2) +
            Math.pow(acceleration.y || 0, 2) +
            Math.pow(acceleration.z || 0, 2)
          );
          
          // Threshold for fall detection (adjust as needed)
          const fallThreshold = 25;
          
          if (accelerationMagnitude > fallThreshold) {
            console.log(`Fall detected! Acceleration: ${accelerationMagnitude}`);
            handleFallDetection();
          }
        }
      };
      
      window.addEventListener('devicemotion', handleMotion);
      
      return () => {
        window.removeEventListener('devicemotion', handleMotion);
      };
    } else {
      setMessage('Device motion not supported on this device. Fall detection will not work.');
      speakPrompt('Device motion not supported on this device');
    }
  }, [permissionsGranted.motion]);
  
  // Get user location when permission is granted
  useEffect(() => {
    if (!permissionsGranted.location) return;
    
    if (navigator.geolocation) {
      console.log('Starting location tracking');
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log(`Location updated: ${position.coords.latitude}, ${position.coords.longitude}`);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setShowMap(true);
        },
        (error) => {
          const errorMsg = `Location error: ${error.message}`;
          console.error(errorMsg);
          setMessage(errorMsg);
          speakPrompt(errorMsg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [permissionsGranted.location]);
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Set up speech recognition when microphone permission is granted
  useEffect(() => {
    if (!permissionsGranted.microphone) return;
    
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const speechErrorMsg = 'Speech recognition not supported in this browser';
      console.error(speechErrorMsg);
      setMessage(speechErrorMsg);
      speakPrompt(speechErrorMsg);
      setShowManualInput(true);
      return;
    }
    
    // Initialize speech recognition
    console.log('Initializing speech recognition');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setVoiceStatus('Active: Listening for voice commands');
      setMessage('Listening for code word...');
      speakPrompt('I am listening. Please say a code word if you need help.');
    };
    
    recognitionRef.current.onresult = (event) => {
      let currentTranscript = '';
      let isFinal = false;
      
      // Process the speech recognition results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        currentTranscript += result[0].transcript;
        if (result.isFinal) isFinal = true;
      }
      
      console.log(`Heard: "${currentTranscript.toLowerCase()}", Final: ${isFinal}`);
      
      // Update the transcript state
      setTranscript(currentTranscript.toLowerCase());
      setVoiceStatus(`Heard: "${currentTranscript.toLowerCase()}"`);
      
      // If this is a final result, check for code words
      if (isFinal) {
        speakPrompt(`I heard: ${currentTranscript.toLowerCase()}`);
        checkForCodeWords(currentTranscript.toLowerCase());
      }
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error(`Speech recognition error: ${event.error}`);
      setVoiceStatus(`Error: ${event.error}. Recognition will restart.`);
      
      if (event.error === 'network') {
        // Network error handling with exponential backoff
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        if (nextRetryCount <= maxRetries.current) {
          const backoffTime = Math.min(1000 * Math.pow(2, nextRetryCount), 10000);
          console.log(`Network error. Retrying in ${backoffTime/1000} seconds. Attempt ${nextRetryCount}/${maxRetries.current}`);
          
          setMessage(`Network issue with speech recognition. Retrying in ${backoffTime/1000} seconds...`);
          setShowManualInput(true);
          
          setTimeout(() => {
            if (isFallDetected && !isProcessing) {
              try {
                startListening();
              } catch (e) {
                console.error('Failed to restart after network error:', e);
                // Show manual input option after max retries
                if (nextRetryCount >= maxRetries.current) {
                  setMessage('Unable to connect to speech recognition service. Please use text input instead.');
                }
              }
            }
          }, backoffTime);
        } else {
          console.log('Maximum retry attempts reached. Switching to manual input.');
          setMessage('Speech recognition unavailable. Please use text input to communicate emergency needs.');
          setShowManualInput(true);
        }
      }
      
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        console.error('Microphone permission denied.');
        setIsListening(false);
        setMessage('Microphone permission denied. Please enable microphone access.');
        setShowManualInput(true);
      }
    };
    
    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      
      if (isFallDetected && !isProcessing && networkStatus === 'online') {
        setVoiceStatus('Restarting voice recognition...');
        setTimeout(() => {
          try {
            console.log('Attempting to restart speech recognition');
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting speech recognition:', error);
            setTimeout(() => {
              try {
                recognitionRef.current.start();
              } catch (secondError) {
                console.error('Second attempt failed:', secondError);
                setIsListening(false);
                setShowManualInput(true);
              }
            }, 2000);
          }
        }, 1000);
      } else {
        setVoiceStatus('Voice recognition stopped');
        setIsListening(false);
        
        if (isFallDetected && networkStatus === 'offline') {
          setShowManualInput(true);
        }
      }
    };
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Speech recognition cleaned up');
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [permissionsGranted.microphone, isFallDetected, isProcessing, networkStatus, retryCount]);
  
  // Function to handle fall detection
  const handleFallDetection = () => {
    if (isFallDetected) return; // Prevent multiple activations
    
    console.log('Fall detection triggered');
    setIsFallDetected(true);
    const fallMessage = 'Fall detected! Please speak a code word if you need help.';
    setMessage(fallMessage);
    
    // Start text-to-speech prompt
    speakPrompt('We detected a possible fall. Do you need help? Say "medical" for ambulance, "police" for police, or "fire" for fire brigade. Say "cancel" if you are okay.');
    
    // Only start listening if we have microphone permission and network is online
    if (permissionsGranted.microphone && networkStatus === 'online') {
      startListening();
    } else {
      // Show manual input if speech recognition isn't available
      setShowManualInput(true);
    }
    
    // Set a timeout to automatically send help if no response
    console.log('Setting 60-second timeout for automatic emergency dispatch');
    timerRef.current = setTimeout(() => {
      if (isFallDetected) {
        const noResponseMsg = 'No response received. Sending emergency services as a precaution.';
        console.log(noResponseMsg);
        setMessage(noResponseMsg);
        speakPrompt(noResponseMsg);
        contactEmergencyService('ambulance');
      }
    }, 60000); // 60 seconds timeout
  };
  
  // Function to speak a prompt using text-to-speech
  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      console.log(`Speaking: "${text}"`);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for better understanding
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Use a clear voice if available
      if (synthesisVoicesLoaded.current) {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('English') || 
          voice.name.includes('US English')
        );
        if (preferredVoice) {
          console.log(`Using preferred voice: ${preferredVoice.name}`);
          utterance.voice = preferredVoice;
        }
      }
      
      // Temporarily pause recognition while speaking to avoid feedback loop
      let wasListening = false;
      if (recognitionRef.current && isListening && !isProcessing) {
        try {
          recognitionRef.current.stop();
          wasListening = true;
          console.log('Temporarily stopped speech recognition while speaking');
        } catch (e) {
          console.error('Error stopping recognition before speech:', e);
        }
      }
      
      utterance.onend = () => {
        console.log('Speech synthesis completed');
        // Restart recognition after speaking if we're in emergency mode
        if (isFallDetected && wasListening && !isProcessing && networkStatus === 'online') {
          setTimeout(() => {
            try {
              console.log('Restarting speech recognition after speaking');
              startListening();
            } catch (e) {
              console.error('Error restarting recognition after speech:', e);
              setShowManualInput(true);
            }
          }, 500);
        }
      };
      
      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('Speech synthesis error:', e);
      }
    } else {
      console.error('Text-to-speech not supported');
    }
  };
  
  // Function to start listening for voice commands
  const startListening = () => {
    if (!permissionsGranted.microphone) {
      console.error('Cannot start listening without microphone permission');
      setMessage('Microphone permission not granted. Cannot listen for commands.');
      setShowManualInput(true);
      return;
    }
    
    if (networkStatus === 'offline') {
      console.error('Cannot start speech recognition while offline');
      setMessage('Speech recognition requires internet connection. Please use text input.');
      setShowManualInput(true);
      return;
    }
    
    if (recognitionRef.current && !isListening) {
      setRetryCount(0); // Reset retry counter on manual start
      
      try {
        console.log('Starting speech recognition');
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceStatus('Starting voice recognition...');
      } catch (error) {
        console.error('Speech recognition error:', error);
        
        if (error.message && error.message.includes('already started')) {
          try {
            console.log('Recognition already started, stopping and restarting');
            recognitionRef.current.stop();
            setTimeout(() => {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (secondError) {
                console.error('Second attempt failed:', secondError);
                setShowManualInput(true);
              }
            }, 1000);
          } catch (stopError) {
            console.error('Error stopping speech recognition:', stopError);
            setShowManualInput(true);
          }
        } else {
          setTimeout(() => {
            try {
              console.log('Retrying speech recognition start after 2 seconds');
              recognitionRef.current.start();
              setIsListening(true);
            } catch (secondError) {
              console.error('Second attempt failed:', secondError);
              setShowManualInput(true);
            }
          }, 2000);
        }
      }
    }
  };
  
  // Function to stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        console.log('Stopping speech recognition');
        recognitionRef.current.stop();
        setIsListening(false);
        setVoiceStatus('Voice recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };
  
  // Check for code words in the transcript
  const checkForCodeWords = (text) => {
    console.log(`Checking for code words in: "${text}"`);
    setIsProcessing(true);
    
    // Check for cancel command
    if (text.includes('cancel') || text.includes('i am okay') || text.includes('i\'m fine') || 
        text.includes('i am ok') || text.includes('i\'m ok')) {
      console.log('Emergency cancelled by user');
      const cancelMsg = 'Emergency cancelled. Glad you are okay!';
      setMessage(cancelMsg);
      speakPrompt(cancelMsg);
      resetEmergencyState();
      return;
    }
    
    // Track found keywords
    const foundKeywords = [];
    
    // Check for emergency code words
    for (const [service, words] of Object.entries(codeWords)) {
      for (const word of words) {
        if (text.includes(word)) {
          foundKeywords.push({ service, word });
          console.log(`Found keyword "${word}" for service "${service}"`);
        }
      }
    }
    
    // Update detected keywords for display
    if (foundKeywords.length > 0) {
      setDetectedKeywords(prev => [...prev, ...foundKeywords.map(k => k.word)]);
      
      // Get the first detected service type
      const serviceType = foundKeywords[0].service;
      
      // Provide feedback that a keyword was recognized
      const detectedMsg = `Detected emergency keyword: "${foundKeywords[0].word}" for ${serviceType} service`;
      console.log(detectedMsg);
      setMessage(detectedMsg);
      speakPrompt(`I understood your request for ${serviceType} service. Contacting emergency services now.`);
      
      // Contact the emergency service
      contactEmergencyService(serviceType);
    } else {
      // No keywords detected, continue listening
      console.log('No emergency keywords detected');
      setIsProcessing(false);
      speakPrompt("I didn't recognize any emergency keywords. Please try again or say cancel if you don't need help.");
    }
  };
  
  // Handle manual text input submission
  const handleManualInputSubmit = (e) => {
    e.preventDefault();
    
    if (manualInput.trim() === '') return;
    
    console.log(`Processing manual input: "${manualInput}"`);
    setTranscript(manualInput.toLowerCase());
    checkForCodeWords(manualInput.toLowerCase());
    setManualInput('');
  };
  
  // Function to simulate emergency responder approaching
  const simulateEmergencyApproach = (serviceType) => {
    if (!userLocation) return;
    
    // Generate a random starting point nearby (within ~1km)
    const randomOffsetLat = (Math.random() - 0.5) * 0.02;
    const randomOffsetLng = (Math.random() - 0.5) * 0.02;
    
    const responderStartPos = [
      userLocation.latitude + randomOffsetLat,
      userLocation.longitude + randomOffsetLng
    ];
    
    setEmergencyResponder({
      isResponding: true,
      position: responderStartPos,
      service: serviceType,
      arrivalTime: Date.now() + 20000 // Arrive in 20 seconds
    });
    
    // Start the animation
    animateEmergencyVehicle(
      responderStartPos, 
      [userLocation.latitude, userLocation.longitude], 
      Date.now(), 
      Date.now() + 20000
    );
  };
  
  // Function to animate emergency vehicle movement
  const animateEmergencyVehicle = (startPos, endPos, startTime, endTime) => {
    const animate = (currentTime) => {
      // Calculate progress (0 to 1)
      const progress = Math.min((currentTime - startTime) / (endTime - startTime), 1);
      
      // Calculate current position using linear interpolation
      const currentLat = startPos[0] + (endPos[0] - startPos[0]) * progress;
      const currentLng = startPos[1] + (endPos[1] - startPos[1]) * progress;
      
      // Update emergency responder position
      setEmergencyResponder(prev => ({
        ...prev,
        position: [currentLat, currentLng]
      }));
      
      // Continue animation until complete
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - responder has arrived
        console.log('Emergency responder has arrived');
        speakPrompt(`${emergencyResponder.service} has arrived at your location.`);
        setMessage(`${emergencyResponder.service.charAt(0).toUpperCase() + emergencyResponder.service.slice(1)} has arrived at your location.`);
      }
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  
  // Function to contact emergency services
  const contactEmergencyService = (serviceType) => {
    console.log(`Contacting emergency services: ${serviceType}`);
    
    // Clear the auto-response timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      console.log('Cleared automatic dispatch timer');
    }
    
    if (!userLocation) {
      const locationErrorMsg = `Error: Cannot contact ${serviceType} without location information`;
      console.error(locationErrorMsg);
      setMessage(locationErrorMsg);
      speakPrompt(locationErrorMsg + '. Please enable location services and try again.');
      setIsProcessing(false);
      return;
    }
    
    // Create emergency message with location
    const emergencyMessage = {
      service: serviceType,
      location: userLocation,
      timestamp: new Date().toISOString(),
      message: `Emergency ${serviceType} service needed at location: 
        https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`
    };
    
    console.log('Sending emergency data:', emergencyMessage);
    
    setMessage(`Contacting ${serviceType} services...`);
    
    setTimeout(() => {
      sendEmailToAuthority(serviceType, emergencyMessage);
      
      const successMsg = `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} has been contacted. Help is on the way.`;
      console.log(successMsg);
      setMessage(successMsg);
      speakPrompt(`${serviceType} has been contacted. Help is on the way. Please stay calm and wait for assistance.`);
      
      // Start simulation of emergency vehicle approaching
      simulateEmergencyApproach(serviceType);
    }, 2000);
  };
  
  // Function to send email to authorities (simulated for hackathon)
  const sendEmailToAuthority = (serviceType, emergencyData) => {
    console.log(`DEMO: Simulating email to ${serviceType} authorities with data:`, emergencyData);
    setMessage(`DEMO: Email sent to ${serviceType} with your location data. Help is coming.`);
  };
  
  // Reset the emergency state
  const resetEmergencyState = () => {
    console.log('Resetting emergency state');
    stopListening();
    setIsProcessing(false);
    setShowManualInput(false);
    setRetryCount(0);
    
    // Reset emergency responder state
    setEmergencyResponder({
      isResponding: false,
      position: [0, 0],
      service: null,
      arrivalTime: null
    });
    
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setTimeout(() => {
      setIsFallDetected(false);
      setTranscript('');
      setDetectedKeywords([]);
      
      setTimeout(() => {
        setMessage('');
        setVoiceStatus('');
      }, 5000);
    }, 5000);
  };
  
  // For testing the fall detection (remove in production)
  const simulateFall = () => {
    console.log('Simulating fall detection');
    handleFallDetection();
  };

  // Function to request necessary permissions
  const requestAllPermissions = async () => {
    console.log('Requesting all permissions');
    setMessage('Requesting necessary permissions...');
    
    // Request microphone permission
    if (!permissionsGranted.microphone) {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getTracks().forEach(track => track.stop());
        setPermissionsGranted(prev => ({ ...prev, microphone: true }));
      } catch (error) {
        console.error('Microphone permission error:', error);
        setMessage('Microphone access denied. Please enable microphone access in your browser settings.');
      }
    }
    
    // Request location permission
    if (!permissionsGranted.location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setPermissionsGranted(prev => ({ ...prev, location: true })),
        (error) => {
          console.error('Location permission error:', error);
          setMessage('Location access denied. Please enable location services for emergency response.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };
  
  return (
    
    <div className="p-6 max-w-5xl mx-auto bg-[#0a0b1d] rounded-xl shadow-lg overflow-hidden">
      <br></br>
      <br></br>
      <br></br>
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Emergency Fall Detection
        </h2>
        <p className="text-white mt-1">Automatic fall detection with voice-activated emergency response</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Network Status Indicator */}
          {networkStatus === 'offline' && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800">You are offline. Voice recognition may not work. Use text input if needed.</p>
            </div>
          )}
          
          {/* Permission Status */}
          {(!permissionsGranted.microphone || !permissionsGranted.location) && (
            <div className="p-4 mb-4 bg-yellow-100 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Permissions Required</h3>
              <p className="text-sm text-yellow-700 mb-3">
                This app requires the following permissions to function properly:
              </p>
              <ul className="text-sm text-yellow-700 mb-3 list-disc pl-5 space-y-1">
                {!permissionsGranted.microphone && (
                  <li>Microphone access (for voice commands)</li>
                )}
                {!permissionsGranted.location && (
                  <li>Location access (to send help to your location)</li>
                )}
              </ul>
              <button 
                onClick={requestAllPermissions}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors shadow-sm"
              >
                Grant Permissions
              </button>
            </div>
          )}
          
          {/* Status Display */}
          {message && (
            <div className={`p-4 mb-4 rounded-lg flex items-start ${
              isFallDetected ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">{message}</p>
                {isFallDetected && <p className="text-sm mt-1">Please respond or help will be automatically dispatched</p>}
              </div>
            </div>
          )}
          
          {/* Manual Text Input (shown when speech recognition fails) */}
          {showManualInput && isFallDetected && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-2">Text Input</h3>
              <p className="text-sm text-gray-600 mb-3">
                If voice commands aren't working, type your emergency keyword below:
              </p>
              <form onSubmit={handleManualInputSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Type 'medical', 'police', 'fire', or 'cancel'"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          )}
          
          {/* Voice Recognition Status */}
          {isListening && (
            <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-red-500 absolute animate-ping"></div>
                  <div className="w-3 h-3 rounded-full bg-red-500 relative"></div>
                </div>
                <p className="ml-3 font-medium text-gray-700">Voice Recognition Active</p>
              </div>
              
              {voiceStatus && (
                <p className="text-sm text-gray-600 ml-6">{voiceStatus}</p>
              )}
              
              {transcript && (
                <div className="mt-3 p-3 bg-white rounded-md shadow-sm border border-gray-100">
                  <p className="text-gray-700"><span className="font-medium">Transcript:</span> {transcript}</p>
                </div>
              )}
              
              {detectedKeywords.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Detected keywords:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {detectedKeywords.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Location Information */}
          {userLocation && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-700 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location Ready
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <p>Latitude: {userLocation.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p>Longitude: {userLocation.longitude.toFixed(6)}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Testing Controls */}
          <div className="mt-6 flex space-x-3">
            <button 
              onClick={simulateFall}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors shadow-sm flex justify-center items-center"
              disabled={!permissionsGranted.microphone || !permissionsGranted.location}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Test Fall Detection
            </button>
            
            <button 
              onClick={resetEmergencyState}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors shadow-sm flex justify-center items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
          
          {/* Emergency Keyword Instructions */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Emergency Voice Commands:
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-2 bg-white rounded border border-gray-100">
                <p className="font-medium text-red-600">Medical Emergency:</p>
                <p className="text-sm text-gray-600">Say "medical", "ambulance", "hospital", "emergency", "help", or "hurt"</p>
              </div>
              <div className="p-2 bg-white rounded border border-gray-100">
                <p className="font-medium text-blue-600">Police Emergency:</p>
                <p className="text-sm text-gray-600">Say "police", "security", "officer", "danger", "threat", or "attacked"</p>
              </div>
              <div className="p-2 bg-white rounded border border-gray-100">
                <p className="font-medium text-orange-600">Fire Emergency:</p>
                <p className="text-sm text-gray-600">Say "fire", "flames", "firefighter", "burning", "smoke", or "heat"</p>
              </div>
              <div className="p-2 bg-white rounded border border-gray-100">
                <p className="font-medium text-green-600">Cancel Emergency:</p>
                <p className="text-sm text-gray-600">Say "cancel", "I'm okay", "I'm fine", "I am ok", or "I'm ok"</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Note: If no response is received within 60 seconds after a fall is detected, emergency medical services will be contacted automatically.</p>
          </div>
        </div>
        
        {/* Map Column */}
        <div>
          {showMap && userLocation && (
            <div className="sticky top-4">
              <div className="p-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <h3 className="px-4 py-2 font-medium text-gray-800 border-b border-gray-200">
                  Location Map {emergencyResponder.isResponding && 
                    `- ${emergencyResponder.service.charAt(0).toUpperCase() + emergencyResponder.service.slice(1)} Responding`}
                </h3>
                <div className="h-[500px] w-full">
                  <MapContainer 
                    center={[userLocation.latitude, userLocation.longitude]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* User marker */}
                    <Marker position={[userLocation.latitude, userLocation.longitude]}>
                      <Popup>
                        Your current location
                      </Popup>
                    </Marker>
                    
                    {/* Emergency responder marker */}
                    {emergencyResponder.isResponding && (
                      <EmergencyMarker 
                        position={emergencyResponder.position} 
                        respondingService={emergencyResponder.service}
                      />
                    )}
                    
                    {/* Map controller to handle auto-center and zoom */}
                    <MapController 
                      userLocation={userLocation} 
                      emergencyResponder={emergencyResponder}
                    />
                  </MapContainer>
                </div>
                
                {/* Emergency status */}
                {emergencyResponder.isResponding && (
                  <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-center">
                      <div className="relative mr-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 absolute animate-ping"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-500 relative"></div>
                      </div>
                      <p className="text-sm font-medium text-blue-800">
                        {emergencyResponder.service.charAt(0).toUpperCase() + emergencyResponder.service.slice(1)} service is en route to your location
                      </p>
                    </div>
                    {emergencyResponder.service === 'ambulance' && (
                      <p className="text-xs text-blue-600 mt-1 ml-5">
                        Medical personnel are being dispatched to provide emergency care
                      </p>
                    )}
                    {emergencyResponder.service === 'police' && (
                      <p className="text-xs text-blue-600 mt-1 ml-5">
                        Officers are en route to respond to your emergency situation
                      </p>
                    )}
                    {emergencyResponder.service === 'fire' && (
                      <p className="text-xs text-blue-600 mt-1 ml-5">
                        Fire brigade has been dispatched and is heading to your location
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Placeholder when map isn't shown */}
          {!showMap && (
            <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center h-[400px] border border-gray-200 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Location Map</h3>
              <p className="text-gray-500 max-w-xs">
                Location permission is required to display the map. Please grant location permission to enable emergency response features.
              </p>
              <button 
                onClick={requestAllPermissions}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-sm"
              >
                Grant Location Permission
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FallDetectionEmergency;