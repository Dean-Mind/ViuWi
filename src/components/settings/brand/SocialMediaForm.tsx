'use client';

import React from 'react';
import { useBrandSettings, useSettingsActions } from '@/stores/settingsStore';
import FormField from '@/components/ui/FormField';
import SettingsCard from '@/components/ui/SettingsCard';
import { Globe, Instagram, Facebook, Twitter, Youtube, Video } from 'lucide-react';

const socialMediaFields = [
  {
    key: 'website' as const,
    label: 'Website',
    placeholder: 'https://www.bisnis-anda.com',
    icon: Globe,
    description: 'URL website bisnis Anda'
  },
  {
    key: 'instagram' as const,
    label: 'Instagram',
    placeholder: '@bisnis_anda',
    icon: Instagram,
    description: 'Username Instagram (dengan atau tanpa @)'
  },
  {
    key: 'facebook' as const,
    label: 'Facebook',
    placeholder: 'bisnis-anda',
    icon: Facebook,
    description: 'Nama halaman Facebook atau URL'
  },
  {
    key: 'twitter' as const,
    label: 'Twitter',
    placeholder: '@bisnis_anda',
    icon: Twitter,
    description: 'Username Twitter (dengan atau tanpa @)'
  },
  {
    key: 'tiktok' as const,
    label: 'TikTok',
    placeholder: '@bisnis_anda',
    icon: Video,
    description: 'Username TikTok (dengan atau tanpa @)'
  },
  {
    key: 'youtube' as const,
    label: 'YouTube',
    placeholder: 'Channel Bisnis Anda',
    icon: Youtube,
    description: 'Nama channel YouTube atau URL'
  }
];

export default function SocialMediaForm() {
  const brandSettings = useBrandSettings();
  const { updateBrandSettings } = useSettingsActions();

  if (!brandSettings) return null;

  const handleSocialMediaChange = (field: keyof typeof brandSettings.socialMedia, value: string) => {
    const updatedSocialMedia = {
      ...brandSettings.socialMedia,
      [field]: value || undefined // Convert empty string to undefined
    };
    
    updateBrandSettings({ socialMedia: updatedSocialMedia });
  };

  return (
    <SettingsCard
      title="Media Sosial & Kehadiran Online"
      description="Tautan media sosial dan website bisnis Anda"
    >
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialMediaFields.map((field) => {
          const IconComponent = field.icon;
          return (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent size={18} className="text-brand-orange" />
                <label className="label-text text-brand-label font-medium">
                  {field.label}
                </label>
              </div>
              
              <FormField
                type="text"
                label=""
                placeholder={field.placeholder}
                value={brandSettings.socialMedia[field.key] || ''}
                onChange={(value) => handleSocialMediaChange(field.key, value)}
                helpText={field.description}
              />
            </div>
          );
        })}
      </div>

      {/* Social Media Tips */}
      <div className="bg-base-200/50 rounded-2xl p-4">
        <h4 className="font-semibold text-base-content mb-3">Social Media Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-base-content/60">
          <div>
            <h5 className="font-medium text-base-content mb-2">Best Practices:</h5>
            <ul className="space-y-1">
              <li>• Keep your social media profiles updated</li>
              <li>• Use consistent branding across platforms</li>
              <li>• Respond to customer messages promptly</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-base-content mb-2">URL Formats:</h5>
            <ul className="space-y-1">
              <li>• Website: Full URL with https://</li>
              <li>• Instagram/Twitter: @username or username</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-base-200/50 rounded-2xl p-4">
        <h4 className="font-semibold text-base-content mb-3">Social Media Links Preview</h4>
        <div className="flex flex-wrap gap-2">
          {socialMediaFields.map((field) => {
            const value = brandSettings.socialMedia[field.key];
            const IconComponent = field.icon;
            
            if (!value) return null;
            
            return (
              <div
                key={field.key}
                className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-xl border border-base-300"
              >
                <IconComponent size={16} className="text-brand-orange" />
                <span className="text-sm text-base-content">{field.label}</span>
                <span className="text-xs text-base-content/60 max-w-[120px] truncate">
                  {value}
                </span>
              </div>
            );
          })}
          
          {Object.values(brandSettings.socialMedia).every(value => !value) && (
            <p className="text-sm text-base-content/60 italic">
              Belum ada tautan media sosial yang ditambahkan
            </p>
          )}
        </div>
      </div>
      </div>
    </SettingsCard>
  );
}
