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
  return (
    <div className="card border border-base-300 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <button
            onClick={() => onToggle(feature.id, !feature.enabled)}
            className={`
              w-6 h-6 border-2 rounded-md flex items-center justify-center
              ${feature.enabled
                ? 'border-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20'
                : 'border-base-content/30 bg-base-100 hover:border-base-content/50'
              }
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-1
            `}
            aria-label={`${feature.enabled ? 'Disable' : 'Enable'} ${feature.title}`}
          >
            {feature.enabled && (
              <CheckmarkIcon width={16} height={16} className="text-brand-orange" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-brand-subheading text-base-content">{feature.title}</h3>
            <button
              onClick={() => onExpand(feature.id)}
              className={`
                p-1 transition-transform duration-200
                ${feature.expanded ? 'rotate-180' : ''}
              `}
            >
              <ChevronDownIcon width={14} height={8} color="var(--color-base-content)" />
            </button>
          </div>
          
          <p className="text-brand-body text-base-content mt-2">
            {feature.description}
          </p>

          {/* Expanded benefits */}
          {feature.expanded && feature.benefits && (
            <div className="mt-4 space-y-1">
              {feature.benefits.map((benefit, index) => (
                <p key={index} className="text-sm text-base-content/60 font-nunito">
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