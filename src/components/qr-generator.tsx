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

type FileExtension = 'svg' | 'png' | 'jpeg' | 'webp';

interface QRGeneratorProps {
  data: string | null;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ data }) => {
  const [fileExt, setFileExt] = useState<FileExtension>('png');
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
        const rawData = await qrCode.getRawData(fileExt);

        if (!rawData) {
          throw new Error('QR code generation failed: no data returned');
        }

        const file = new File([rawData], `qrcode.${fileExt}`, {
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

  if (!data) return null;

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg p-4 shadow-md ring-1 ring-gray-300">
      <h2 className="text-lg font-semibold">QR Code Generator</h2>

      <div className="flex items-center gap-2">
        <Select
          value={fileExt}
          onValueChange={(value: FileExtension) => setFileExt(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svg">SVG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="webp">WEBP</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            if (qrUrl) window.open(qrUrl, '_blank');
          }}
          disabled={!qrUrl}>
          Open in New Tab
        </Button>
      </div>

      {loading ? (
        <p>Uploading QR code...</p>
      ) : qrUrl ? (
        <Image
          src={qrUrl}
          alt="QR Code"
          width={200}
          height={200}
          className="rounded border"
        />
      ) : (
        <p>No QR code generated yet.</p>
      )}
    </div>
  );
};
