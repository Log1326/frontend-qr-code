'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type QRCodeStyling from 'qr-code-styling';
import { useEffect, useState } from 'react';

import { ShareButton } from '@/components/share-button';
import { Button } from '@/components/ui/button';
import { useQRCode } from '@/hooks/useQRCode';
import { localFetch } from '@/services/utils/localFetch';

interface QRGeneratorProps {
  data: string | null;
  recipeId?: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ data, recipeId }) => {
  const fileExt = 'svg';
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { generateQRCode } = useQRCode();
  const router = useRouter();
  useEffect(() => {
    if (!data || !recipeId || qrUrl) return;
    const uploadQRCode = async () => {
      if (!data) {
        setQrUrl(null);
        return;
      }

      setLoading(true);

      try {
        const qr = generateQRCode(data);
        setQrCode(qr);

        const rawData = await qr.getRawData(fileExt);
        if (!rawData)
          throw new Error('QR code generation failed: no data returned');

        const file = new File([rawData], `${recipeId}.${fileExt}`, {
          type: `image/${fileExt}`,
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipeId', recipeId);
        const result = await localFetch<{ url: string }>('/upload', {
          method: 'POST',
          body: formData,
        });

        if (result?.url) setQrUrl(result.url);
        else throw new Error('No URL returned from upload');
      } catch (error) {
        console.error('Upload failed:', error);
        setQrUrl(null);
      } finally {
        setLoading(false);
      }
    };

    uploadQRCode();
  }, [data, generateQRCode, recipeId, qrUrl]);

  const handleDownload = () => {
    if (qrCode) {
      qrCode.download({ extension: fileExt });
    }
  };

  if (!data) return null;

  return (
    <div className="relative flex w-full max-w-4xl flex-col items-center gap-4 rounded-lg p-4 shadow-md ring-1 ring-gray-300 lg:w-1/2">
      <h2 className="text-lg font-semibold">QR Code Generator</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Uploading QR code...</p>
      ) : qrUrl ? (
        <Image
          src={qrUrl}
          alt="QR Code"
          width={375}
          height={375}
          className="ring-gray-20 max-w-sm rounded border"
        />
      ) : (
        <p className="text-sm text-red-500">QR code is not available</p>
      )}

      <div className="flex items-center gap-2">
        <Button variant="default" onClick={handleDownload} disabled={!qrCode}>
          Download
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/recipes/' + recipeId)}
          disabled={!qrUrl}>
          Open in New Tab
        </Button>
      </div>

      <div className="absolute right-3 top-3">
        <ShareButton url={data} />
      </div>
    </div>
  );
};
