"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { QRGenerator } from "@/components/QRGenerator";
import { RecipeForm } from "@/components/RecipeForm";
import { useState } from "react";


export default function Page() {
  const [qrData, setQrData] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center min-h-screen p-6 gap-6 bg-background text-foreground">
          <div className="absolute top-4 right-4">
            <ModeToggle/>
          </div>
      <RecipeForm onGenerate={setQrData} />
      <QRGenerator data={qrData} />
    </div>
  );
}
