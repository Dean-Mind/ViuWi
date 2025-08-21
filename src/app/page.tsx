'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="w-full bg-base-100/95 backdrop-blur-sm border-b border-base-content/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-brand-heading text-brand-orange font-bold">ViuWi</h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="btn btn-ghost text-base-content hover:text-brand-orange"
              >
                Sign In
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Hero Title */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content">
                  Welcome to{' '}
                  <span className="text-brand-orange">ViuWi</span>
                </h1>
                <p className="text-xl sm:text-2xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                  Intelligent chatbot platform for businesses to automate customer service
                  and enhance customer experience with AI-powered conversations.
                </p>
              </div>

              {/* Value Proposition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-6 bg-base-200 rounded-2xl">
                  <div className="text-brand-orange text-2xl mb-3">🤖</div>
                  <h3 className="font-semibold text-base-content mb-2">AI-Powered</h3>
                  <p className="text-base-content/70 text-sm">
                    Advanced AI technology for natural conversations
                  </p>
                </div>
                <div className="p-6 bg-base-200 rounded-2xl">
                  <div className="text-brand-orange text-2xl mb-3">⚡</div>
                  <h3 className="font-semibold text-base-content mb-2">Easy Setup</h3>
                  <p className="text-base-content/70 text-sm">
                    Get started in minutes with our guided onboarding
                  </p>
                </div>
                <div className="p-6 bg-base-200 rounded-2xl">
                  <div className="text-brand-orange text-2xl mb-3">📈</div>
                  <h3 className="font-semibold text-base-content mb-2">Business Growth</h3>
                  <p className="text-base-content/70 text-sm">
                    Improve customer satisfaction and reduce response time
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGetStarted}
                  className="btn bg-brand-orange hover:bg-brand-orange-light text-white border-none rounded-2xl px-8 py-3 text-lg font-semibold min-w-48"
                >
                  Get Started
                </button>
                <button
                  onClick={handleSignIn}
                  className="btn btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white rounded-2xl px-8 py-3 text-lg font-semibold min-w-48"
                >
                  Sign In
                </button>
              </div>

              {/* Coming Soon Notice */}
              <div className="mt-12 p-4 bg-base-200/50 rounded-2xl border border-base-content/10">
                <p className="text-base-content/60 text-sm">
                  🚧 This is a placeholder landing page. Full landing page coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}