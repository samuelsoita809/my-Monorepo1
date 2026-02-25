import React, { useState, useEffect } from 'react';
import { EVENTS } from '@inventory/shared';

const MultiStepForm = ({ steps, onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    // Track Step Started
    useEffect(() => {
        console.log(`[ANALYTICS] ${EVENTS.STEP_STARTED}:`, {
            step_id: steps[currentStep].id,
            step_title: steps[currentStep].title,
            timestamp: new Date().toISOString()
        });
    }, [currentStep, steps]);

    const handleNext = (stepData) => {
        const newData = { ...formData, ...stepData };
        setFormData(newData);

        // Track Step Completed
        console.log(`[ANALYTICS] ${EVENTS.STEP_COMPLETED}:`, {
            step_id: steps[currentStep].id,
            timestamp: new Date().toISOString()
        });

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(newData);
        }
    };

    const handleCancelWithTracking = () => {
        // Track Step Failed / Drop-off
        console.log(`[ANALYTICS] ${EVENTS.STEP_FAILED}:`, {
            step_id: steps[currentStep].id,
            reason: 'USER_CANCELLED',
            timestamp: new Date().toISOString()
        });
        onCancel();
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="glass-panel rounded-[60px] overflow-hidden border border-white/10 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] h-full w-full flex flex-col">
            {/* High-Fidelity Step Indicator */}
            <div className="flex bg-white/5 h-2">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={`flex-1 transition-all duration-1000 ease-in-out ${idx <= currentStep ? 'bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.6)]' : 'bg-white/2'
                            }`}
                    />
                ))}
            </div>

            <div className="flex-1 p-12 md:p-20 flex flex-col justify-between text-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center space-x-4 px-6 py-2 rounded-full bg-white/5 border border-white/5 mx-auto">
                        <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-black text-[10px]">
                            {currentStep + 1}
                        </span>
                        <span className="text-slate-500 font-black text-[9px] uppercase tracking-[0.4em]">
                            Phased Protocol 00{currentStep + 1}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center py-10">
                    <CurrentStepComponent
                        data={formData}
                        onNext={handleNext}
                        onBack={handleBack}
                        onCancel={handleCancelWithTracking}
                        isFirst={currentStep === 0}
                        isLast={currentStep === steps.length - 1}
                    />
                </div>

                <div className="pt-8 border-t border-white/5">
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">
                        {steps[currentStep].title} Integration Active
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MultiStepForm;
