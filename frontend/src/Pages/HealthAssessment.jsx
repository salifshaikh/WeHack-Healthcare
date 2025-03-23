import { useState } from "react";

const HealthAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  // Questions for the assessment
  const questions = [
    {
      id: 1,
      question: "How often have you felt down, depressed, or hopeless over the past two weeks?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 2,
      question: "How often have you had little interest or pleasure in doing things you usually enjoy?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 3,
      question: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 4,
      question: "How often have you felt tired or had little energy?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 5,
      question: "How often have you had poor appetite or been overeating?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 6,
      question: "How often have you felt bad about yourself or that you're a failure or have let yourself or your family down?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 7,
      question: "How often have you had trouble concentrating on things such as reading or watching TV?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 8,
      question: "How often have you been feeling anxious, nervous, or on edge?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    },
    {
      id: 9,
      question: "How often have you not been able to stop or control worrying?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" }
      ]
    }
  ];

  // Handle selecting an answer
  const handleSelectOption = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
    
    // Add animation delay before moving to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResult();
      }
    }, 500);
  };

  // Calculate assessment result
  const calculateResult = () => {
    setLoading(true);
    
    // Calculate total score
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    
    // Determine severity based on total score
    let severity;
    let color;
    let recommendations;
    
    if (totalScore <= 4) {
      severity = "Minimal";
      color = "green";
      recommendations = [
        "Continue with your daily routine and self-care practices",
        "Practice mindfulness and relaxation techniques",
        "Consider regular exercise if you don't already"
      ];
    } else if (totalScore <= 9) {
      severity = "Mild";
      color = "blue";
      recommendations = [
        "Consider speaking with someone you trust about your feelings",
        "Focus on self-care: sleep, exercise, and healthy eating",
        "Try meditation or breathing exercises daily"
      ];
    } else if (totalScore <= 14) {
      severity = "Moderate";
      color = "yellow";
      recommendations = [
        "Consider reaching out to a mental health professional",
        "Establish a regular self-care routine",
        "Try journaling to track your emotions and identify triggers"
      ];
    } else if (totalScore <= 19) {
      severity = "Moderately Severe";
      color = "orange";
      recommendations = [
        "We recommend consulting with a mental health professional",
        "Consider joining a support group",
        "Practice stress-reduction techniques daily"
      ];
    } else {
      severity = "Severe";
      color = "red";
      recommendations = [
        "Please consult with a mental health professional as soon as possible",
        "Reach out to a trusted person for support",
        "Contact a crisis helpline if you're experiencing severe distress"
      ];
    }

    setResult({
      score: totalScore,
      severity,
      color,
      recommendations
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  // Start the assessment
  const startAssessment = () => {
    setShowIntro(false);
  };

  // Reset the assessment
  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setResult(null);
    setShowIntro(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 bg-gradient-to-b from-[#0a0b1d] to-[#131438] text-white">
      {/* Background Elements */}
      <br></br>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div 
          className="text-center mb-10"
          style={{
            opacity: 0,
            animation: "fadeInDown 1s ease forwards"
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block mb-4">
            Mental Health Assessment
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>

        {/* Main Content Area */}
        <div 
          className="bg-[#13142d]/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50"
          style={{
            opacity: 0,
            animation: "fadeIn 1s ease 0.3s forwards",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 255, 0.1), 0 8px 10px -6px rgba(0, 0, 255, 0.1)"
          }}
        >
          {/* Intro Screen */}
          {showIntro && (
            <div 
              className="text-center"
              style={{
                opacity: 0,
                animation: "fadeIn 1s ease 0.5s forwards"
              }}
            >
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Your Mental Health Check-In</h2>
                <p className="text-gray-300 mb-6">
                  This quick assessment helps you understand your current mental well-being. 
                  Your answers are confidential and will help provide personalized recommendations.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center p-3 bg-blue-900/30 rounded-lg">
                    <div className="mr-3 bg-blue-500/20 p-2 rounded-full">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-300">Your responses are private and secure</p>
                  </div>
                  <div className="flex items-center p-3 bg-blue-900/30 rounded-lg">
                    <div className="mr-3 bg-blue-500/20 p-2 rounded-full">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-300">Takes approximately 3-5 minutes to complete</p>
                  </div>
                </div>
                <button
                  onClick={startAssessment}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Begin Assessment</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>
          )}

          {/* Assessment Questions */}
          {!showIntro && !submitted && (
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      transition: "width 0.5s ease"
                    }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div
                key={currentQuestion}
                style={{
                  opacity: 0,
                  animation: "fadeInRight 0.5s ease forwards"
                }}
              >
                <h3 className="text-xl font-medium text-white mb-6">
                  {questions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(questions[currentQuestion].id, option.value)}
                      className="w-full text-left px-6 py-4 bg-[#1a1b3a] hover:bg-[#232456] border border-gray-700 rounded-lg transition-all duration-300 flex items-center"
                      style={{
                        opacity: 0,
                        animation: `fadeInUp 0.5s ease ${0.1 + index * 0.1}s forwards`
                      }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 border-blue-400 mr-4 flex items-center justify-center ${answers[questions[currentQuestion].id] === option.value ? 'bg-blue-400' : ''}`}>
                        {answers[questions[currentQuestion].id] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-t-blue-500 border-blue-200/30 rounded-full"
                  style={{
                    animation: "spin 1s linear infinite"
                  }}
                ></div>
              </div>
              <p className="mt-4 text-lg text-blue-300">Analyzing your responses...</p>
            </div>
          )}

          {/* Results Screen */}
          {submitted && result && (
            <div 
              className="text-center"
              style={{
                opacity: 0,
                animation: "fadeIn 1s ease forwards"
              }}
            >
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${result.color === 'green' ? '#10b981' : result.color === 'blue' ? '#3b82f6' : result.color === 'yellow' ? '#f59e0b' : result.color === 'orange' ? '#f97316' : '#ef4444'}, ${result.color === 'green' ? '#059669' : result.color === 'blue' ? '#2563eb' : result.color === 'yellow' ? '#d97706' : result.color === 'orange' ? '#ea580c' : '#dc2626'})`,
                  opacity: 0,
                  animation: "scaleIn 0.5s ease 0.3s forwards"
                }}
              >
                <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 
                className="text-2xl font-bold text-white mb-2"
                style={{
                  opacity: 0,
                  animation: "fadeIn 0.5s ease 0.5s forwards"
                }}
              >
                Your Assessment Results
              </h2>

              <div 
                className="mb-6 text-lg"
                style={{
                  opacity: 0,
                  animation: "fadeIn 0.5s ease 0.7s forwards"
                }}
              >
                <p>Score: <span className="font-bold">{result.score} / {questions.length * 3}</span></p>
                <p>Severity: <span className={`font-bold ${
                  result.color === 'green' ? 'text-green-400' : 
                  result.color === 'blue' ? 'text-blue-400' : 
                  result.color === 'yellow' ? 'text-yellow-400' : 
                  result.color === 'orange' ? 'text-orange-400' : 'text-red-400'
                }`}>{result.severity}</span></p>
              </div>

              <div 
                className="bg-[#1a1b3a] rounded-lg p-6 mb-8"
                style={{
                  opacity: 0,
                  animation: "fadeIn 0.5s ease 0.9s forwards"
                }}
              >
                <h3 className="font-medium text-lg mb-3 text-blue-300">Recommendations:</h3>
                <ul className="space-y-2 text-left">
                  {result.recommendations.map((recommendation, index) => (
                    <li 
                      key={index} 
                      className="flex items-start"
                      style={{
                        opacity: 0,
                        animation: `fadeInLeft 0.5s ease ${1.1 + index * 0.2}s forwards`
                      }}
                    >
                      <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div 
                className="space-y-4"
                style={{
                  opacity: 0,
                  animation: "fadeIn 0.5s ease 1.7s forwards"
                }}
              >
                <button
                  onClick={resetAssessment}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
                >
                  Take Assessment Again
                </button>
                <div>
                  <a href="#resources" className="text-blue-400 hover:text-blue-300 underline block mt-4">
                    View Mental Health Resources
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInLeft {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HealthAssessment;