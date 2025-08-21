'use client';

import { FeatureOption } from '@/types/onboarding';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import CheckmarkIcon from '../icons/CheckmarkIcon';

interface FeatureCardProps {
  feature: FeatureOption;
  onToggle: (featureId: string, enabled: boolean) => void;
  onExpand: (featureId: string) => void;
}

export default function FeatureCard({ feature, onToggle, onExpand }: FeatureCardProps) {
  const isBasic = feature.isBasic || false;
  const isComingSoon = feature.isComingSoon || false;

  return (
    <div className={`
      card border rounded-2xl p-6 transition-all duration-200
      ${isBasic
        ? 'border-success/30 bg-success/5'
        : isComingSoon
          ? 'border-base-300/50 bg-base-200/30 opacity-70'
          : 'border-base-300 bg-base-100'
      }
    `}>
      <div className="flex items-start gap-4">
        {/* Checkbox or Status Indicator */}
        <div className="flex-shrink-0 mt-1">
          {isBasic ? (
            // Always enabled indicator for basic features
            <div className="w-6 h-6 border-2 border-success bg-success/20 rounded-md flex items-center justify-center">
              <CheckmarkIcon width={16} height={16} className="text-success" />
            </div>
          ) : isComingSoon ? (
            // Coming soon indicator
            <div className="w-6 h-6 border-2 border-base-content/20 bg-base-200 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-base-content/40" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            // Regular checkbox for optional features
            <button
              onClick={() => onToggle(feature.id, !feature.enabled)}
              className={`
                w-6 h-6 border-2 rounded-md flex items-center justify-center transition-colors duration-200
                ${feature.enabled
                  ? 'border-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20'
                  : 'border-base-content/30 bg-base-100 hover:border-base-content/50'
                }
                focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-1
              `}
              aria-label={`${feature.enabled ? 'Disable' : 'Enable'} ${feature.title}`}
            >
              {feature.enabled && (
                <CheckmarkIcon width={16} height={16} className="text-brand-orange" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className={`text-brand-subheading ${isComingSoon ? 'text-base-content/60' : 'text-base-content'}`}>
                {feature.title}
              </h3>
              {isBasic && (
                <span className="px-2 py-1 text-xs font-semibold text-success bg-success/10 rounded-full">
                  Termasuk
                </span>
              )}
              {isComingSoon && (
                <span className="px-2 py-1 text-xs font-semibold text-base-content/60 bg-base-200 rounded-full">
                  Segera Hadir
                </span>
              )}
            </div>
            <button
              onClick={() => onExpand(feature.id)}
              className={`
                p-1 transition-transform duration-200
                ${feature.expanded ? 'rotate-180' : ''}
                ${isComingSoon ? 'opacity-50' : ''}
              `}
              disabled={isComingSoon}
            >
              <ChevronDownIcon width={14} height={8} color="var(--color-base-content)" />
            </button>
          </div>

          <p className={`text-brand-body mt-2 ${isComingSoon ? 'text-base-content/50' : 'text-base-content'}`}>
            {feature.description}
          </p>

          {/* Expanded benefits */}
          {feature.expanded && feature.benefits && (
            <div className="mt-4 space-y-1">
              {feature.benefits.map((benefit, index) => (
                <p key={index} className={`text-sm font-nunito ${isComingSoon ? 'text-base-content/40' : 'text-base-content/60'}`}>
                  • {benefit}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}