'use client';
import { RecipeForm } from '@/components/form/recipe-form';
import { QRGenerator } from '@/components/qr-generator';
import { useState } from 'react';

export default function Page() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [recipeId, setRecipeId] = useState<string>('');

  return (
    <>
      <RecipeForm onQRCodeGenerated={setQrData} setRecipeId={setRecipeId} />
      <QRGenerator data={qrData} recipeId={recipeId} />
    </>
  );
}
