'use client';
import { QRGenerator } from '@/components/QRGenerator';
import { RecipeForm } from '@/components/RecipeForm';
import { useState } from 'react';

export default function Page() {
  const [qrData, setQrData] = useState<string | null>(null);
  return (
    <>
      <RecipeForm onQRCodeGenerated={setQrData} />
      <QRGenerator data={qrData} />
    </>
  );
}
