'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { useQRCode } from '@/hooks/useQRCode';
import QRCodeStyling from 'qr-code-styling';
import { ShareButton } from './share-button';

type FileExtension = 'svg' | 'png' | 'jpeg' | 'webp';

interface QRGeneratorProps {
  data: string | null;
  recipeId: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ data, recipeId }) => {
  const [fileExt, setFileExt] = useState<FileExtension>('png');
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { generateQRCode } = useQRCode();

  useEffect(() => {
    const uploadQRCode = async () => {
      if (!data) {
        setQrUrl(null);
        return;
      }

      setLoading(true);

      try {
        const qrCode = generateQRCode(data);
        setQrCode(qrCode);
        const rawData = await qrCode.getRawData(fileExt);

        if (!rawData) {
          throw new Error('QR code generation failed: no data returned');
        }

        const file = new File([rawData], `${recipeId}.${fileExt}`, {
          type: `image/${fileExt}`,
        });

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();
        if (result?.url) {
          setQrUrl(result.url);
        } else {
          setQrUrl(null);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setQrUrl(null);
      } finally {
        setLoading(false);
      }
    };

    uploadQRCode();
  }, [data, fileExt, generateQRCode]);

  const handleDownload = () =>
    qrCode && qrCode.download({ extension: fileExt });
  if (!data) return null;

  return (
    <div className="relative flex w-full max-w-4xl flex-col items-center gap-4 rounded-lg p-4 shadow-md ring-1 ring-gray-300 lg:w-1/2">
      <h2 className="text-lg font-semibold">QR Code Generator</h2>

      {loading ? (
        <p>Uploading QR code...</p>
      ) : qrUrl ? (
        <Image
          src={qrUrl}
          alt="QR Code"
          width={384}
          height={384}
          className="max-w-sm rounded"
        />
      ) : (
        <p>No QR code generated yet.</p>
      )}

      <div className="flex items-center gap-2">
        <Select
          value={fileExt}
          onValueChange={(value: FileExtension) => setFileExt(value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp">WEBP</SelectItem>
            <SelectItem value="svg">SVG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default" onClick={handleDownload}>
          Download
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (qrUrl) window.open(qrUrl, '_blank');
          }}
          disabled={!qrUrl}>
          Open in New Tab
        </Button>
      </div>
      <div className="absolute right-3 top-3">
        <ShareButton qrCode={qrCode} url={data} />
      </div>
    </div>
  );
};
