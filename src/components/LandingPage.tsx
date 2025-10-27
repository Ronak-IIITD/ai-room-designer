import React, { useState } from 'react';
import { CameraIcon, PencilIcon, SparklesIcon } from './Icons';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  onGetStarted: () => void;
  onGoogleSignIn: () => Promise<void>;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (email: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError?: string;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-white/80 dark:hover:bg-slate-800/80 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        
        <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 dark:from-primary-500/30 dark:to-accent-500/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                {icon}
            </div>
            <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white mb-3 font-display">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onGoogleSignIn,
  onEmailSignIn,
  onEmailSignUp,
  isAuthenticated,
  authLoading,
  authError,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      onGetStarted();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleGoogleSignIn = async () => {
    await onGoogleSignIn();
    if (!authError) {
      setShowAuthModal(false);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    await onEmailSignIn(email, password);
    if (!authError) {
      setShowAuthModal(false);
    }
  };

  const handleEmailSignUp = async (email: string, password: string, name: string) => {
    await onEmailSignUp(email, password, name);
    if (!authError) {
      setShowAuthModal(false);
    }
  };

  return (
    <>
      <div className="text-center py-16 md:py-24 relative">
        {/* Floating gradient orbs in background */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <header className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100/80 dark:bg-accent-900/30 backdrop-blur-sm rounded-full text-accent-700 dark:text-accent-300 text-sm font-medium mb-6 border border-accent-200/50 dark:border-accent-700/50 animate-slide-down">
            <SparklesIcon className="w-4 h-4" />
            <span>Powered by Advanced AI Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up font-display">
            <span className="gradient-text">Reimagine Your Space</span>
            <br />
            <span className="text-slate-900 dark:text-white">with AI Magic</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Upload a photo of any room, describe your dream design, and watch our AI bring it to life in seconds. Your perfect room is just a prompt away.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handlePrimaryAction}
              className="group relative bg-gradient-to-r from-primary-500 via-accent-500 to-amber-500 text-white font-bold py-4 px-10 rounded-2xl hover:shadow-glow-lg transition-all duration-500 transform hover:scale-105 text-lg overflow-hidden"
              disabled={authLoading}
            >
              <span className="relative z-10 flex items-center gap-2">
                {authLoading ? (
                  'Processing...'
                ) : isAuthenticated ? (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Open the Designer
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Get Started Free
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            
            {!isAuthenticated && !authLoading && (
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required • Sign in to save your designs
              </p>
            )}
          </div>
        </header>
      
        <section className="mt-28 md:mt-36 max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Three simple steps to your dream room</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                  icon={<CameraIcon className="w-8 h-8" />}
                  title="1. Upload"
                  description="Snap or choose a photo of the room you want to transform. Clear, well-lit images work best for stunning results."
              />
              <FeatureCard 
                  icon={<PencilIcon className="w-8 h-8" />}
                  title="2. Describe"
                  description="Tell the AI your vision using descriptive words like 'minimalist', 'cozy cabin', or 'mid-century modern'."
              />
              <FeatureCard 
                  icon={<SparklesIcon className="w-8 h-8" />}
                  title="3. Generate"
                  description="Click generate and let our AI create a stunning, high-quality redesign concept in seconds."
              />
          </div>
        </section>

        {/* Social proof section */}
        <section className="mt-28 max-w-4xl mx-auto relative z-10">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold gradient-text mb-2 font-display">10K+</div>
                <div className="text-slate-600 dark:text-slate-400">Rooms Redesigned</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2 font-display">5K+</div>
                <div className="text-slate-600 dark:text-slate-400">Happy Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2 font-display">4.9★</div>
                <div className="text-slate-600 dark:text-slate-400">Average Rating</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onGoogleSignIn={handleGoogleSignIn}
          onEmailSignIn={handleEmailSignIn}
          onEmailSignUp={handleEmailSignUp}
          loading={authLoading}
          error={authError || ''}
        />
      )}
    </>
  );
};