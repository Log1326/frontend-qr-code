'use client';
import { QRGenerator } from '@/components/QRGenerator';
import { RecipeForm } from '@/components/Form/RecipeForm';
import { useState } from 'react';

export default function Page() {
  const [qrData, setQrData] = useState<string | null>(null);
  console.log(qrData);
  return (
    <>
      <RecipeForm onQRCodeGenerated={setQrData} />
      <QRGenerator data={qrData} />
    </>
  );
}
