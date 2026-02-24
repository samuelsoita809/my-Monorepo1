import React, { useState } from 'react';

/**
 * MultiStepForm: High-Visibility Modal Card
 */
const MultiStepForm = ({ steps, onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const handleNext = (stepData) => {
        const newData = { ...formData, ...stepData };
        setFormData(newData);

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(newData);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="bg-white rounded-3xl overflow-hidden border-8 border-slate-900 shadow-[20px_20px_0_0_rgba(15,23,42,0.15)]">
            {/* Visual Step Indicator */}
            <div className="bg-slate-100 flex h-4">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={`flex-1 transition-all duration-300 ${idx <= currentStep ? 'bg-slate-900' : 'bg-slate-200'
                            }`}
                    />
                ))}
            </div>

            <div className="p-8 md:p-12">
                <div className="mb-8 flex items-center justify-between">
                    <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Step {currentStep + 1} / {steps.length}
                    </span>
                    <span className="text-slate-300 font-black text-xs uppercase italic tracking-tighter">
                        System: {steps[currentStep].title}
                    </span>
                </div>

                <div className="min-h-[300px]">
                    <CurrentStepComponent
                        data={formData}
                        onNext={handleNext}
                        onBack={handleBack}
                        onCancel={onCancel}
                        isFirst={currentStep === 0}
                        isLast={currentStep === steps.length - 1}
                    />
                </div>
            </div>
        </div>
    );
};

export default MultiStepForm;
