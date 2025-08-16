'use client';

interface QRCodeDisplayProps {
  qrCodeUrl?: string;
}

export default function QRCodeDisplay({ qrCodeUrl }: QRCodeDisplayProps) {
  return (
    <div className="card border border-base-300 rounded-md p-8">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-80 h-80 bg-base-200 rounded-md flex items-center justify-center">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="QR Code for WhatsApp connection"
              className="w-full h-full object-contain rounded-md"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl text-base-content/30 mb-4">⬜</div>
              <p className="text-brand-label text-base-content">QR CODE</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}