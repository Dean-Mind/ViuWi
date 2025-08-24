'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useFeature } from '@/stores/featureToggleStore';
import { PageFeatureSwitcher } from '@/components/ui/FeatureSwitcher';
import FeatureDisabledState from '@/components/ui/FeatureDisabledState';
import {
  usePaymentProviders,
  useSelectedProviderId,
  useSelectedProvider,
  usePaymentActions,
  useApiKeyInput,
  usePaymentFormDirty,
  usePaymentSaving,
  usePaymentError
} from '@/stores/paymentStore';
import { PaymentProvider, PaymentProviderStatus } from '@/data/paymentProviderMockData';
import { useAppToast } from '@/hooks/useAppToast';
import MockDataNotice from '@/components/ui/MockDataNotice';

export default function PembayaranPage() {
  const isFeatureEnabled = useFeature('pembayaran');
  const providers = usePaymentProviders();
  const selectedProviderId = useSelectedProviderId();
  const selectedProvider = useSelectedProvider();
  const { setSelectedProvider, loadSettings } = usePaymentActions();

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Auto-select first available or configured provider if none selected
  useEffect(() => {
    if (!selectedProviderId && providers.length > 0) {
      const firstUsable = providers.find(p =>
        p.status === PaymentProviderStatus.AVAILABLE ||
        p.status === PaymentProviderStatus.CONFIGURED
      );
      if (firstUsable) {
        setSelectedProvider(firstUsable.id);
      }
    }
  }, [selectedProviderId, providers, setSelectedProvider]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-orange">
                Pembayaran
              </h1>
              <p className="text-base-content/70 mt-1">
                Kelola integrasi payment gateway untuk bisnis Anda
              </p>
            </div>

            {/* Feature Switcher */}
            <PageFeatureSwitcher
              featureKey="pembayaran"
              featureName="Pembayaran"
            />
          </div>

          {/* Feature Content */}
          {isFeatureEnabled ? (
            <>
              {/* Mock Data Notice */}
              <MockDataNotice feature="pembayaran" />

              {/* Main Content */}
          <div className="flex gap-6 flex-1">
            {/* Provider Selection Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-base-200 rounded-2xl p-4">
                <h3 className="font-semibold text-base-content mb-4">Provider</h3>

                {providers.map((provider) => {
                  const isSelected = selectedProviderId === provider.id;
                  const isAvailable = provider.status === PaymentProviderStatus.AVAILABLE;
                  const isConfigured = provider.status === PaymentProviderStatus.CONFIGURED;

                  return (
                    <div
                      key={provider.id}
                      onClick={() => (isAvailable || isConfigured) && setSelectedProvider(provider.id)}
                      className={`
                        bg-base-100 rounded-xl p-4 mb-3 transition-all duration-200
                        ${isSelected ? 'border-2 border-brand-orange' : 'border border-base-300'}
                        ${(isAvailable || isConfigured) ? 'cursor-pointer hover:shadow-md' : 'opacity-60'}
                        ${!(isAvailable || isConfigured) ? 'cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-base-300 p-2 shadow-sm">
                          {provider.logo ? (
                            <Image
                              src={provider.logo}
                              alt={`${provider.displayName} logo`}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          ) : (
                            <div className={`w-full h-full ${provider.logoColor} rounded flex items-center justify-center`}>
                              <span className="text-white font-bold text-lg">{provider.logoText}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base-content">{provider.displayName}</h4>
                          <p className={`text-sm ${
                            isConfigured ? 'text-green-600' :
                            isAvailable ? 'text-blue-600' :
                            'text-base-content/60'
                          }`}>
                            {isConfigured ? 'Configured' :
                             isAvailable ? 'Available' :
                             'Coming Soon'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="flex-1">
              {selectedProvider ? (
                <div className="bg-base-200 rounded-2xl p-6">
                  {/* Provider Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-white border border-base-300 p-3 shadow-sm">
                      {selectedProvider.logo ? (
                        <Image
                          src={selectedProvider.logo}
                          alt={`${selectedProvider.displayName} logo`}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <div className={`w-full h-full ${selectedProvider.logoColor} rounded-lg flex items-center justify-center`}>
                          <span className="text-white font-bold text-2xl">{selectedProvider.logoText}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-base-content">{selectedProvider.displayName}</h2>
                      <p className="text-base-content/60">{selectedProvider.description}</p>
                    </div>
                  </div>

                  {selectedProvider.status !== PaymentProviderStatus.COMING_SOON ? (
                    <ApiKeyForm provider={selectedProvider} />
                  ) : (
                    <ComingSoonMessage provider={selectedProvider} />
                  )}
                </div>
              ) : (
                <div className="bg-base-200 rounded-2xl p-6 flex items-center justify-center h-96">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-base-content mb-2">
                      Pilih Payment Provider
                    </h3>
                    <p className="text-base-content/60">
                      Pilih provider dari sidebar untuk mengkonfigurasi API key
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
            </>
          ) : (
            <FeatureDisabledState
              featureKey="pembayaran"
              featureName="Pembayaran"
              description="Aktifkan fitur ini untuk mengelola integrasi payment gateway bisnis Anda."
              benefits={[
                "Integrasi dengan berbagai penyedia pembayaran",
                "Manajemen API key yang aman",
                "Pemrosesan pembayaran real-time",
                "Monitoring dan laporan transaksi",
                "Konfirmasi pembayaran otomatis"
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// API Key Form Component
interface ApiKeyFormProps {
  provider: PaymentProvider;
}

function ApiKeyForm({ provider }: ApiKeyFormProps) {
  const apiKeyInput = useApiKeyInput();
  const isFormDirty = usePaymentFormDirty();
  const isSaving = usePaymentSaving();
  const error = usePaymentError();
  const { setApiKeyInput, saveApiKey, removeApiKey, resetForm, clearError } = usePaymentActions();
  const toast = useAppToast();

  const handleSave = async () => {
    if (!apiKeyInput.trim()) {
      toast.error('API Key tidak boleh kosong');
      return;
    }

    try {
      await saveApiKey(provider.id, apiKeyInput);
      toast.success('API Key berhasil disimpan');
    } catch (_error) {
      toast.error('Gagal menyimpan API Key');
    }
  };

  const handleCancel = () => {
    resetForm();
    clearError();
  };

  const handleRemove = async () => {
    if (confirm(`Apakah Anda yakin ingin menghapus API Key ${provider.displayName}?`)) {
      try {
        await removeApiKey(provider.id);
        toast.success('API Key berhasil dihapus');
      } catch (_error) {
        toast.error('Gagal menghapus API Key');
      }
    }
  };

  const isConfigured = provider.status === PaymentProviderStatus.CONFIGURED;

  return (
    <div className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text font-medium">API Key</span>
          {isConfigured && (
            <span className="label-text-alt text-success font-medium">
              ✓ Configured
            </span>
          )}
        </label>
        <input
          type="password"
          placeholder={
            isConfigured
              ? `API Key tersimpan (${provider.apiKey?.slice(-4) || '****'})`
              : `Masukkan API Key ${provider.displayName}`
          }
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          className={`input input-bordered w-full rounded-xl ${
            isConfigured ? 'border-success' : ''
          }`}
          disabled={isSaving}
        />
        {error && (
          <p className="text-error text-sm mt-1">{error}</p>
        )}
        {isConfigured && !error && (
          <p className="text-success text-sm mt-1">
            API Key sudah dikonfigurasi dan siap digunakan
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-base-100 rounded-xl p-4">
        <h4 className="font-medium text-base-content mb-2">Cara mendapatkan API Key:</h4>
        <ul className="text-sm text-base-content/70 space-y-1">
          {provider.instructions.map((instruction, index) => (
            <li key={index}>• {instruction}</li>
          ))}
        </ul>

        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 mb-2">
            💡 <strong>Tips:</strong> Pastikan Anda sudah memiliki akun {provider?.displayName || 'provider'} dan sudah melakukan verifikasi bisnis untuk mendapatkan API Key.
          </p>
        </div>

        {provider.website && (
          <div className="mt-3">
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-orange hover:underline text-sm font-medium"
            >
              🔗 Buka Halaman API Keys {provider?.displayName || 'provider'} →
            </a>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleCancel}
          disabled={isSaving || !isFormDirty}
          className="btn btn-outline rounded-xl"
        >
          Cancel
        </button>

        {isConfigured && (
          <button
            onClick={handleRemove}
            disabled={isSaving}
            className="btn btn-error btn-outline rounded-xl"
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menghapus...
              </>
            ) : (
              'Hapus API Key'
            )}
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving || !isFormDirty || !apiKeyInput.trim()}
          className="btn bg-brand-orange hover:bg-brand-orange/90 text-white border-none rounded-xl"
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Menyimpan...
            </>
          ) : (
            'Simpan API Key'
          )}
        </button>
      </div>
    </div>
  );
}

// Coming Soon Message Component
interface ComingSoonMessageProps {
  provider: PaymentProvider;
}

function ComingSoonMessage({ provider }: ComingSoonMessageProps) {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white border border-base-300 p-4 shadow-sm opacity-60">
          {provider.logo ? (
            <Image
              src={provider.logo}
              alt={`${provider.displayName} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          ) : (
            <div className={`w-full h-full ${provider.logoColor} rounded-xl flex items-center justify-center`}>
              <span className="text-white font-bold text-3xl">{provider.logoText}</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          {provider.displayName} Coming Soon
        </h3>
        <p className="text-base-content/60 max-w-md mx-auto">
          Kami sedang mengembangkan integrasi dengan {provider.displayName}.
          Fitur ini akan segera tersedia dalam update mendatang.
        </p>
      </div>

      {provider.website && (
        <div className="mt-6">
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline rounded-xl"
          >
            Kunjungi {provider.displayName}
          </a>
        </div>
      )}
    </div>
  );
}