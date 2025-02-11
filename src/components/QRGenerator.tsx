"use client";
import { useRouter } from "next/navigation";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import { ShareButton } from "./ShareButton";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type FileExtension = "svg" | "png" | "jpeg" | "webp";

const houseIcons = [
  "/house-1.svg", "/house-2.svg", "/house-3.svg", "/house-4.svg", "/house-5.svg",
  "/house-6.svg", "/house-7.svg", "/house-8.svg", "/house-9.svg", "/house-10.svg",
  "/house-11.svg", "/house-12.svg", "/house-13.svg", "/house-14.svg", "/house-15.svg",
  "/house-16.svg", "/house-17.svg", "/house-18.svg",
];

const gradientColors = [
  ["#FFDEE9", "#B5FFFC"], // Розовый → Голубой
  ["#D4FC79", "#96E6A1"], // Лаймовый → Зеленый
  ["#FFF1EB", "#ACE0F9"], // Бежевый → Голубой
  ["#FFD3A5", "#FD6585"], // Персиковый → Розовый
  ["#F3E7E9", "#E3EEFF"], // Светло-розовый → Светло-голубой
  ["#C2E9FB", "#A1C4FD"], // Нежный голубой градиент
  ["#FAACA8", "#DDD6F3"], // Персиковый → Сиреневый
  ["#FF9A9E", "#FAD0C4"], // Розовый → Лососевый
  ["#B5FFFC", "#E8F0FF"], // Бирюзовый → Светлый голубой
  ["#FAD0C4", "#FFD3A5"], // Лососевый → Персиковый
];

interface QRGeneratorProps {
  data: string | null;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fileExt, setFileExt] = useState<FileExtension>("svg");
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const { push } = useRouter();


  const randomHouse = houseIcons[Math.floor(Math.random() * houseIcons.length)];
  const [color1, color2] = gradientColors[Math.floor(Math.random() * gradientColors.length)];

  useEffect(() => {
    if (!data) return;

    const qr = new QRCodeStyling({
      type: "canvas",
      shape: "square",
      width: 300,
      height: 300,
      data: data || "404",
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H",
      },
      imageOptions: {
        saveAsBlob: true,
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 2,
      },
      dotsOptions: {
        type: "extra-rounded",
        roundSize: true,
        color: color1,
        gradient: {
          type: "linear",
          rotation: Math.random() * Math.PI,
          colorStops: [
            { offset: 0, color: color1 },
            { offset: 1, color: color2 },
          ],
        },
      },
      backgroundOptions: {
        round: 0,
        color: "#ffffff",
      },
      image: randomHouse,
      cornersSquareOptions: {
        type: "dot",
        color: "#000000",
        gradient: {
          type: "linear",
          rotation: Math.random() * Math.PI,
          colorStops: [
            { offset: 0, color: color2 },
            { offset: 1, color: color1 },
          ],
        },
      },
      cornersDotOptions: {
        type: "dot",
        color: color1,
      },
    });

    setQrCode(qr);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (ref.current && qrCode) {
      ref.current.innerHTML = "";
      qrCode.append(ref.current);
    }
  }, [qrCode]);

  const onDownloadClick = () => {
    if (qrCode) qrCode.download({ extension: fileExt });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4  shadow-md rounded-lg relative">
      <h2 className="text-lg font-semibold">QR Code Generator</h2>
      {data && (
        <>
          <div className="p-4 bg-gray-200 rounded-lg" ref={ref}/>
          <div className="flex items-center justify-around gap-2 w-full ">
            <Select value={fileExt} onValueChange={(value: FileExtension) => setFileExt(value)}>
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
            <Button
              variant='default'
              onClick={onDownloadClick}
            >
              Download
            </Button>
            <Button
              variant='link'
              onClick={() => push(String(data))}
            >
              Check
            </Button>
            <div className="absolute top-3 right-3">
            <ShareButton/>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
