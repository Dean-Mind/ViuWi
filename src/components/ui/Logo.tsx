'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  /** Size variant for the logo */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Custom width override */
  width?: number;
  /** Custom height override */
  height?: number;
  /** Whether to show the text alongside the logo */
  showText?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Click handler for interactive logos */
  onClick?: () => void;
  /** Priority loading for above-the-fold logos */
  priority?: boolean;
}

/** Size configurations for the logo */
const sizeConfig = {
  xs: { width: 24, height: 24 },
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
  '2xl': { width: 80, height: 80 },
};

export default function Logo({
  size = 'md',
  width,
  height,
  showText = false,
  className = '',
  alt = 'ViuWi - AI Customer Service',
  onClick,
  priority = false,
}: LogoProps) {
  const dimensions = sizeConfig[size];
  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;

  const logoElement = (
    <div
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="relative flex-shrink-0">
        <Image
          src="/ViuWi.png"
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          className="object-contain"
          priority={priority}
          sizes={`${finalWidth}px`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1 className="text-brand-heading text-brand-orange font-bold leading-tight">
            ViuWi
          </h1>
          <p className="text-xs text-base-content/60 -mt-1">AI Customer Service</p>
        </div>
      )}
    </div>
  );

  return logoElement;
}

/** Specialized logo components for specific use cases */

export function LandingLogo({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Logo
      size="xl"
      showText={true}
      className={className}
      onClick={onClick}
      priority={true}
      alt="ViuWi - AI Customer Service Platform"
    />
  );
}

export function SidebarLogo({ isCollapsed, className = '' }: { isCollapsed: boolean; className?: string }) {
  if (isCollapsed) {
    return (
      <Logo
        size="sm"
        className={className}
        alt="ViuWi"
        priority={true}
      />
    );
  }

  return (
    <Logo
      size="lg"
      showText={false}
      className={className}
      alt="ViuWi"
      priority={true}
    />
  );
}

export function HeaderLogo({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Logo
      size="md"
      className={className}
      onClick={onClick}
      alt="ViuWi Dashboard"
    />
  );
}

export function AuthLogo({ className = '' }: { className?: string }) {
  return (
    <Logo
      size="lg"
      showText={true}
      className={className}
      priority={true}
      alt="ViuWi Authentication"
    />
  );
}

export function FaviconLogo() {
  return (
    <Logo
      size="xs"
      alt="ViuWi"
      priority={true}
    />
  );
}