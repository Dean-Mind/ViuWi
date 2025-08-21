'use client';

import React, { useEffect } from 'react';
import { useSettingsTab, useSettingsActions, useSettingsLoading, useSettingsError } from '@/stores/settingsStore';
import SettingsHeader from './SettingsHeader';
import SettingsNavigation from './SettingsNavigation';
import BrandSettingsSection from './brand/BrandSettingsSection';
import AccountSettingsSection from './account/AccountSettingsSection';
import { useAppToast } from '@/hooks/useAppToast';

export default function SettingsPage() {
  const activeTab = useSettingsTab();
  const isLoading = useSettingsLoading();
  const error = useSettingsError();
  const { setActiveTab, loadBrandSettings, loadAccountSettings, clearError } = useSettingsActions();
  const toast = useAppToast();

  // Load settings data on mount
  useEffect(() => {
    loadBrandSettings();
    loadAccountSettings();
  }, [loadBrandSettings, loadAccountSettings]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, toast, clearError]);

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto no-scrollbar">
        <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            <SettingsHeader />
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg text-brand-orange mb-4"></div>
                <p className="text-base-content/60">Loading settings...</p>
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
          <SettingsHeader />

          <SettingsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="space-y-6">
            {activeTab === 'brand' ? (
              <BrandSettingsSection />
            ) : (
              <AccountSettingsSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
