import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keyboard as Skateboard, Camera, MapPin } from 'lucide-react';

export function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: Skateboard,
      title: "Welcome to SkateGame",
      description: "The streets are your arena",
      action: "Get Started"
    },
    {
      icon: Camera,
      title: "Create Your Profile",
      description: "Show off your style",
      action: "Next"
    },
    {
      icon: MapPin,
      title: "Enable Location",
      description: "Find spots and skaters nearby",
      action: "Let's Skate"
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step === steps.length - 1) {
      navigate('/');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex flex-col items-center justify-center text-white p-6">
      <div className="mb-12">
        {React.createElement(currentStep.icon, { size: 64 })}
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{currentStep.title}</h1>
      <p className="text-lg mb-12 text-center">{currentStep.description}</p>

      <button
        onClick={handleNext}
        className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold text-lg"
      >
        {currentStep.action}
      </button>

      <div className="flex gap-2 mt-12">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === step ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}