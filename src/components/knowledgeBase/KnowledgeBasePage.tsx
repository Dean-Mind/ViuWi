'use client';

import React, { useEffect } from 'react';
import {
  useKnowledgeBaseData,
  useLoadKnowledgeBaseFromStorage,
  useGenerateAIGuidelines,
  useSystemPromptRegenerationNeeded,
  useSetSystemPromptRegenerationNeeded
} from '@/stores/knowledgeBaseStore';
import { useAuth } from '@/stores/authStore';
import { useBusinessProfileStore } from '@/stores/businessProfileStore';
import { useAppToast } from '@/hooks/useAppToast';
import DocumentsSection from './DocumentsSection';
import TextContentSection from './TextContentSection';
import URLContentSection from './URLContentSection';
import AIGuidelinesSection from './AIGuidelinesSection';
import SystemPromptRegenerationBanner from './SystemPromptRegenerationBanner';

export default function KnowledgeBasePage() {
  const knowledgeBaseData = useKnowledgeBaseData();
  const loadFromStorage = useLoadKnowledgeBaseFromStorage();
  const generateAIGuidelines = useGenerateAIGuidelines();
  const systemPromptRegenerationNeeded = useSystemPromptRegenerationNeeded();
  const setSystemPromptRegenerationNeeded = useSetSystemPromptRegenerationNeeded();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { businessProfile, loadFromSupabase: loadBusinessProfile, isLoading: businessProfileLoading } = useBusinessProfileStore();
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const toast = useAppToast();

  // Load business profile when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !businessProfile && !businessProfileLoading) {
      loadBusinessProfile(user.id).catch(error => {
        console.error('Failed to load business profile:', error);
      });
    }
  }, [isAuthenticated, user, businessProfile, businessProfileLoading, loadBusinessProfile]);

  // Load knowledge base data after auth and business profile are ready
  useEffect(() => {
    // Only load data after auth initialization is complete and business profile is loaded (if user is authenticated)
    const authReady = !authLoading;
    const businessProfileReady = !isAuthenticated || (businessProfile !== null || !businessProfileLoading);

    if (authReady && businessProfileReady) {
      loadFromStorage();
    }
  }, [loadFromStorage, authLoading, isAuthenticated, businessProfile, businessProfileLoading]);

  // Calculate statistics
  const stats = {
    documentsCount: knowledgeBaseData.documents.files.length,
    hasTextContent: knowledgeBaseData.textContent.content.length > 0,
    hasUrlContent: knowledgeBaseData.urlContent.url.length > 0,
    hasAIGuidelines: knowledgeBaseData.aiGuidelines.content.length > 0,
  };

  const handleGenerateGuidelines = async () => {
    setIsRegenerating(true);
    try {
      await generateAIGuidelines();
      toast.success('AI Guidelines regenerated successfully!');
      // Clear the regeneration needed flag after generating
      setSystemPromptRegenerationNeeded(false);
    } catch (_error) {
      toast.error('Failed to regenerate AI Guidelines. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDismissRegenerationBanner = () => {
    setSystemPromptRegenerationNeeded(false);
  };

  // Show loading state while auth or business profile is loading
  if (authLoading || (isAuthenticated && businessProfileLoading)) {
    return (
      <div className="h-full overflow-y-auto no-scrollbar">
        <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            <div>
              <h1 className="text-3xl font-bold text-brand-orange">Knowledge Base</h1>
              <p className="text-base-content/70 mt-1">
                Kelola basis pengetahuan dan AI guidelines untuk chatbot Anda
              </p>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-brand-orange"></span>
                <p className="text-base-content/70">
                  {authLoading ? 'Initializing authentication...' : 'Loading your business profile...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-brand-orange">Knowledge Base</h1>
            <p className="text-base-content/70 mt-1">
              Kelola basis pengetahuan dan AI guidelines untuk chatbot Anda
            </p>
          </div>

          {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-base-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-base-content/70">Dokumen</p>
                      <p className="text-2xl font-bold text-base-content">{stats.documentsCount}</p>
                    </div>
                    <div className="text-brand-orange">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-base-content/70">Konten Teks</p>
                      <p className="text-2xl font-bold text-base-content">
                        {stats.hasTextContent ? '✓' : '✗'}
                      </p>
                    </div>
                    <div className="text-brand-orange">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-base-content/70">Website URL</p>
                      <p className="text-2xl font-bold text-base-content">
                        {stats.hasUrlContent ? '✓' : '✗'}
                      </p>
                    </div>
                    <div className="text-brand-orange">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-base-content/70">AI Guidelines</p>
                      <p className="text-2xl font-bold text-base-content">
                        {stats.hasAIGuidelines ? '✓' : '✗'}
                      </p>
                    </div>
                    <div className="text-brand-orange">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate AI Guidelines Button */}
              {(stats.documentsCount > 0 || stats.hasTextContent || stats.hasUrlContent) && !stats.hasAIGuidelines && (
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerateGuidelines}
                    className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl px-8"
                  >
                    🤖 Generate AI Guidelines
                  </button>
                </div>
              )}

              {/* System Prompt Regeneration Banner */}
              {systemPromptRegenerationNeeded && stats.hasAIGuidelines && (
                <SystemPromptRegenerationBanner
                  onRegenerate={handleGenerateGuidelines}
                  onDismiss={handleDismissRegenerationBanner}
                  reason="Your knowledge base content has been updated"
                  isLoading={isRegenerating}
                />
              )}



              {/* Main Content Sections */}
              <div className="space-y-6">
                {/* Documents Section */}
                <DocumentsSection />

                {/* Text Content Section */}
                <TextContentSection />

                {/* URL Content Section */}
                <URLContentSection />

                {/* AI Guidelines Section */}
                <AIGuidelinesSection />
              </div>
        </div>
      </div>
    </div>
  );
}
