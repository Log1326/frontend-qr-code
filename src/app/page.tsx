'use client';
import { RecipeForm } from '@/components/form/recipe-form';
import { QRGenerator } from '@/components/qr-generator';
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
