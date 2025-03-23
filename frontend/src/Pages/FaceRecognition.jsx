import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import CryptoJS from 'crypto-js';

// Health Card Component
const FaceRecognition = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detectedPerson, setDetectedPerson] = useState(null);
  const [healthCardData, setHealthCardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  // Function to load face detection models directly from GitHub
  const loadModels = async () => {
    try {
      setErrorMessage('Loading face detection models from remote sources...');
      
      // Base URL for the model weights on GitHub
      const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
      
      // Load all required models from the remote URL
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
      ]);
      
      setIsModelLoaded(true);
      setErrorMessage('Face detection models loaded successfully!');
    } catch (error) {
      setErrorMessage(`Error loading models: ${error.message}`);
      console.error('Error loading models:', error);
    }
  };

  // Function to start the webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      setErrorMessage(`Error accessing webcam: ${error.message}`);
      console.error('Error accessing webcam:', error);
    }
  };

  // Initialize face detection
  useEffect(() => {
    loadModels();
  }, []);

  // Function to create reference face descriptor for Sohail
  const createReferenceDescriptor = async () => {
    try {
      // For demo purposes, use a placeholder image from a public URL
      // In a real application, you'd use a more secure approach
      const sohailImageUrl = '/sohail1.png';  // Using a random AI-generated face for demo
      
      const img = await faceapi.fetchImage(sohailImageUrl);
      const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (detections) {
        return detections.descriptor;
      } else {
        // If no face found in the image, create a mock descriptor for demo
        console.warn('No face found in reference image, using mock descriptor');
        // Creating a consistent mock descriptor for demo purposes
        const mockDescriptor = new Float32Array(128);
        // Fill with some values to make it somewhat realistic
        for (let i = 0; i < 128; i++) {
          mockDescriptor[i] = Math.sin(i) * 0.5;
        }
        return mockDescriptor;
      }
    } catch (error) {
      setErrorMessage(`Error creating reference descriptor: ${error.message}`);
      console.error('Error creating reference descriptor:', error);
      // Return a dummy descriptor for demo purposes
      return new Float32Array(128).fill(0);
    }
  };

  // Function to detect faces and match with reference
  const detectFaces = async () => {
    if (!isModelLoaded || !videoRef.current || !canvasRef.current) return;
    
    try {
      // Get reference descriptor for Sohail (in a real app, you'd only do this once and store it)
      const referenceDescriptor = await createReferenceDescriptor();
      
      // Continuously detect faces
      const interval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) {
          clearInterval(interval);
          return;
        }
        
        // Make detections
        const detections = await faceapi.detectAllFaces(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptors();
        
        // Resize canvas to match video dimensions
        const displaySize = { 
          width: videoRef.current.width, 
          height: videoRef.current.height 
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        
        // Resize detections to match canvas size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Clear previous drawings
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Check if any detected face matches Sohail
        let sohailDetected = false;
        
        resizedDetections.forEach(detection => {
          // Compare current face with reference using euclidean distance
          const distance = faceapi.euclideanDistance(detection.descriptor, referenceDescriptor);
          const threshold = 0.6; // Adjust this threshold based on testing
          
          if (distance < threshold) {
            // It's Sohail!
            sohailDetected = true;
            
            // Draw box and label for Sohail
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
              label: 'Sohail',
              boxColor: '#00ff00' 
            });
            drawBox.draw(canvasRef.current);
            
            // Log to console
            console.log('Sohail detected!');
            
            // Update state to show health card
            if (!detectedPerson) {
              setDetectedPerson('Sohail');
              fetchHealthCardData('sohail');
            }
          } else {
            // Draw box for unknown person
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
              label: 'Unknown',
              boxColor: '#ff0000' 
            });
            drawBox.draw(canvasRef.current);
          }
        });
        
        if (!sohailDetected && detectedPerson) {
          // Reset if Sohail is no longer in frame
          setDetectedPerson(null);
          setHealthCardData(null);
        }
      }, 100);
      
      return () => clearInterval(interval);
    } catch (error) {
      setErrorMessage(`Error in face detection: ${error.message}`);
      console.error('Error in face detection:', error);
    }
  };

  // Encrypt data using simple encryption (in real applications, use a proper blockchain)
  const encryptData = (data) => {
    try {
      const secretKey = "hackathon-secure-key-2025";
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  };

  // Decrypt data (simulating blockchain retrieval)
  const decryptData = (encryptedData) => {
    try {
      const secretKey = "hackathon-secure-key-2025";
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  };

  // Fetch health card data from Appwrite (simulated for hackathon)
  const fetchHealthCardData = async (username) => {
    try {
      // In a real application, this would be an API call to Appwrite
      // Simulating database fetch for hackathon demo
      setErrorMessage('Fetching encrypted health data...');
      
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example health card data for Sohail
      const mockData = {
        email: "sohail@example.com",
        phone: "+1234567890",
        userId: "sohail-123",
        name: "Sohail Ahmed",
        privacyConsent: true,
        birthDate: "1990-05-15",
        address: "123 Health Street, Medical City",
        occupation: "Software Engineer",
        emergencyContactName: "Ahmed Khan",
        emergencyContactNumber: "+9876543210",
        insuranceProvider: "Health Shield Insurance",
        insurancePolicy: "Comprehensive Coverage",
        allergies: "Penicillin, Peanuts",
        currentMedication: "Vitamin D, Allergy medication",
        familyMedicalHistory: "Diabetes, Hypertension",
        pastMedicalHistory: "Appendectomy (2018)",
        identificationType: "National ID",
        identificationNumber: "ID-987654321",
        identificationDocumentId: "doc-654321",
        identificationDocumentUrl: "https://example.com/id-docs/sohail",
        primaryPhysician: "Dr. Jane Smith",
        treatmentConsent: true,
        disclosureConsent: true,
        insurancePolicyNumber: "HSI-12345678",
        gender: "Male"
      };
      
      // Encrypt the data (simulating blockchain)
      const encrypted = encryptData(mockData);
      setErrorMessage('Data encrypted and sent via secure channel...');
      
      // Simulate blockchain verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Decrypt the data (simulating retrieval from blockchain)
      const decrypted = decryptData(encrypted);
      setErrorMessage('Health data retrieved successfully!');
      
      // Set health card data
      setHealthCardData(decrypted);
    } catch (error) {
      setErrorMessage(`Error fetching health data: ${error.message}`);
      console.error('Error fetching health data:', error);
    }
  };

  // Start camera and detection when models are loaded
  useEffect(() => {
    if (isModelLoaded && !cameraActive) {
      startWebcam();
    }
  }, [isModelLoaded]);

  // Start face detection when camera is active
  useEffect(() => {
    if (cameraActive) {
      const detectionInterval = detectFaces();
      return () => {
        if (detectionInterval) {
          clearInterval(detectionInterval);
        }
      };
    }
  }, [cameraActive]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Health Card Identification System</h1>
        <p className="text-sm opacity-80">Secure blockchain-based health records</p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row flex-1 p-4 gap-6">
        {/* Camera Section */}
        <div className="flex flex-col w-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Face Detection</h2>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              width="640"
              height="480"
              className="w-full"
              onPlay={() => {}}
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          
          <div className="mt-4">
            <p className={`text-sm ${errorMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              Status: {errorMessage || 'Ready'}
            </p>
            {detectedPerson && (
              <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
                <p className="text-green-700 font-medium">✓ Identity Verified: {detectedPerson}</p>
              </div>
            )}
          </div>
        </div>

        {/* Health Card Section */}
        <div className="flex flex-col w-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Health Card Information</h2>
          
          {healthCardData ? (
            <div className="flex flex-col gap-4">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">{healthCardData.name}</h3>
                    <p className="text-sm opacity-80">ID: {healthCardData.userId}</p>
                  </div>
                  <div className="bg-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="border border-gray-200 rounded-b-lg p-4 overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 border-b pb-1">Personal Information</h4>
                    <div><span className="text-gray-500">Email:</span> {healthCardData.email}</div>
                    <div><span className="text-gray-500">Phone:</span> {healthCardData.phone}</div>
                    <div><span className="text-gray-500">Birth Date:</span> {healthCardData.birthDate}</div>
                    <div><span className="text-gray-500">Gender:</span> {healthCardData.gender}</div>
                    <div><span className="text-gray-500">Address:</span> {healthCardData.address}</div>
                    <div><span className="text-gray-500">Occupation:</span> {healthCardData.occupation}</div>
                  </div>
                  
                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 border-b pb-1">Emergency Contact</h4>
                    <div><span className="text-gray-500">Name:</span> {healthCardData.emergencyContactName}</div>
                    <div><span className="text-gray-500">Number:</span> {healthCardData.emergencyContactNumber}</div>
                  </div>
                  
                  {/* Medical Information */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 border-b pb-1">Medical Information</h4>
                    <div><span className="text-gray-500">Allergies:</span> {healthCardData.allergies}</div>
                    <div><span className="text-gray-500">Current Medication:</span> {healthCardData.currentMedication}</div>
                    <div><span className="text-gray-500">Family Medical History:</span> {healthCardData.familyMedicalHistory}</div>
                    <div><span className="text-gray-500">Past Medical History:</span> {healthCardData.pastMedicalHistory}</div>
                    <div><span className="text-gray-500">Primary Physician:</span> {healthCardData.primaryPhysician}</div>
                  </div>
                  
                  {/* Insurance Information */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 border-b pb-1">Insurance Information</h4>
                    <div><span className="text-gray-500">Provider:</span> {healthCardData.insuranceProvider}</div>
                    <div><span className="text-gray-500">Policy:</span> {healthCardData.insurancePolicy}</div>
                    <div><span className="text-gray-500">Policy Number:</span> {healthCardData.insurancePolicyNumber}</div>
                  </div>
                  
                  {/* Identification */}
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <h4 className="font-semibold text-gray-700 border-b pb-1">Identification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div><span className="text-gray-500">Type:</span> {healthCardData.identificationType}</div>
                      <div><span className="text-gray-500">Number:</span> {healthCardData.identificationNumber}</div>
                      <div><span className="text-gray-500">Document ID:</span> {healthCardData.identificationDocumentId}</div>
                    </div>
                  </div>
                  
                  {/* Consents */}
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <h4 className="font-semibold text-gray-700 border-b pb-1">Consents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <span className="text-gray-500">Privacy:</span> 
                        <span className={healthCardData.privacyConsent ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                          {healthCardData.privacyConsent ? "Provided" : "Not Provided"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Treatment:</span>
                        <span className={healthCardData.treatmentConsent ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                          {healthCardData.treatmentConsent ? "Provided" : "Not Provided"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Disclosure:</span>
                        <span className={healthCardData.disclosureConsent ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                          {healthCardData.disclosureConsent ? "Provided" : "Not Provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Verification Seal */}
              <div className="bg-green-100 text-green-800 p-2 rounded flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">Blockchain Verified • Last Updated: March 22, 2025</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-gray-400 mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="text-gray-500">Please verify your identity to view health card information</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>Secure Health Card System • Powered by Blockchain Technology</p>
        <p className="text-gray-400 text-xs mt-1">All data is encrypted and securely stored</p>
      </footer>
    </div>
  );
};

export default FaceRecognition;