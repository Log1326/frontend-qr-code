'use client';
import { useRouter } from 'next/navigation';
import type QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQRCode } from '@/hooks/useQRCode';
import { ShareButton } from './share-button';

type FileExtension = 'svg' | 'png' | 'jpeg' | 'webp';

interface QRGeneratorProps {
  data: string | null;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fileExt, setFileExt] = useState<FileExtension>('svg');
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const { push } = useRouter();
  const { generateQRCode } = useQRCode();

  useEffect(() => {
    if (data) {
      const newQRCode = generateQRCode(data);
      setQrCode(newQRCode);
    }
  }, [data, generateQRCode]);

  useEffect(() => {
    if (ref.current && qrCode) {
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
    }
  }, [qrCode]);

  const handleDownload = () =>
    qrCode && qrCode.download({ extension: fileExt });

  if (!data) return null;

  return (
    <div className="relative flex flex-col items-center gap-4 rounded-lg p-4 shadow-md ring-1 ring-gray-300">
      <h2 className="text-lg font-semibold">QR Code Generator</h2>
      <div className="rounded-xl border p-2">
        <div ref={ref} />
      </div>
      <div className="flex w-full items-center justify-around gap-2">
        <Select
          value={fileExt}
          onValueChange={(value: FileExtension) => setFileExt(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svg">SVG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="webp">WEBP</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="link" onClick={() => push(String(data))}>
          Link
        </Button>
        <div className="absolute right-3 top-3">
          <ShareButton qrCode={qrCode} url={data} />
        </div>
      </div>
    </div>
  );
};
