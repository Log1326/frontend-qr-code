'use client';
import { useState } from 'react';

import { RecipeForm } from '@/components/form/recipe-form';
import { QRGenerator } from '@/components/qr-generator';

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
