import React, { useState } from 'react';

/**
 * MultiStepForm: Core component practicing "Intentional Engineering"
 * Uses slot injection and tracks funnel progression.
 */
const MultiStepForm = ({ steps, onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const trackFunnel = (signal, payload = {}) => {
        console.log(`[FUNNEL] ${signal}`, { step: steps[currentStep].id, ...payload });
        // In Level 3, this would be a real API call
    };

    const handleNext = (stepData) => {
        const newData = { ...formData, ...stepData };
        setFormData(newData);

        trackFunnel('STEP_COMPLETED');

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            console.log(`[FUNNEL] STEP_STARTED`, { step: steps[currentStep + 1].id });
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
        <div className="glass-card p-8 rounded-3xl border border-white/10 max-w-lg w-full">
            <div className="flex justify-between mb-8">
                {steps.map((step, idx) => (
                    <div key={step.id} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${idx <= currentStep ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-500'
                            }`}>
                            {idx + 1}
                        </div>
                        <span className={`text-[10px] mt-2 uppercase tracking-tighter ${idx === currentStep ? 'text-slate-200' : 'text-slate-600'
                            }`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="min-h-[200px] flex flex-col justify-center">
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
    );
};

export default MultiStepForm;
