import React, { useState } from 'react';
import LoginComponent from '../components/Auth/LoginComponent';
import RegisterComponent from '../components/Auth/RegisterComponent';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 w-full flex justify-center">
                {isLogin ? (
                    <LoginComponent onSwitch={() => setIsLogin(false)} />
                ) : (
                    <RegisterComponent onSwitch={() => setIsLogin(true)} />
                )}
            </div>

            <footer className="absolute bottom-8 text-center opacity-30">
                <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.6em]">
                    Nexus Secure Layer • Secure Transmission Protocol v4.0
                </p>
            </footer>
        </div>
    );
};

export default AuthPage;
