import React, { useState } from 'react';
import { Tour, TourStep } from '../types';
import { Clock, Route, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourDetailsProps {
  tour: Tour;
  onBack: () => void;
}

export function TourDetails({ tour, onBack }: TourDetailsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to neighborhood
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">{tour.name}</h2>
          <p className="text-gray-600 mb-4">{tour.description}</p>
          
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-blue-600" />
              <span>{tour.distance}</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Step {currentStep + 1} of {tour.steps.length}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextStep}
                  disabled={currentStep === tour.steps.length - 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <StepDetail step={tour.steps[currentStep]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDetail({ step }: { step: TourStep }) {
  return (
    <div>
      {step.image && (
        <img
          src={step.image}
          alt={step.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
      <p className="text-gray-600">{step.description}</p>
    </div>
  );
}