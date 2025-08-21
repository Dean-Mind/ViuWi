// Props types for onboarding components
export interface OnboardingStep0Props {
  onNext: () => void;
  isLoading?: boolean;
  error?: string;
}

export interface OnboardingStep1Props {
  onDocumentUpload: (files: FileList) => void;
  onTextSubmit: (text: string) => Promise<void>;
  onWebsiteLinkSubmit: (url: string) => Promise<void>;
  onNext: () => void;
  isLoading?: boolean;
  error?: string;
}

export interface OnboardingStep2Props {
  features: FeatureOption[];
  onFeatureToggle: (featureId: string, enabled: boolean) => void;
  onFeatureExpand: (featureId: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export interface OnboardingStep3Props {
  qrCodeUrl: string;
  onQRScanned: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export interface FeatureOption {
  id: string;
  title: string;
  description: string;
  benefits?: string[];
  enabled: boolean;
  expanded: boolean;
  isBasic?: boolean;
  isComingSoon?: boolean;
  category?: 'basic' | 'optional' | 'future';
}

export interface OnboardingFlowProps {
  initialStep?: number; // 0-3, default 0
  onComplete: () => void;
}