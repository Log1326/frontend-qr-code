import QRCodeStyling from 'qr-code-styling';
import { useCallback } from 'react';

const gradientColors: string[][] = [
  ['#FFDEE9', '#B5FFFC'], // Розовый → Голубой
  ['#D4FC79', '#96E6A1'], // Лаймовый → Зеленый
  ['#FFF1EB', '#ACE0F9'], // Бежевый → Голубой
  ['#FFD3A5', '#FD6585'], // Персиковый → Розовый
  ['#F3E7E9', '#E3EEFF'], // Светло-розовый → Светло-голубой
  ['#C2E9FB', '#A1C4FD'], // Нежный голубой градиент
  ['#FAACA8', '#DDD6F3'], // Персиковый → Сиреневый
  ['#FF9A9E', '#FAD0C4'], // Розовый → Лососевый
  ['#B5FFFC', '#E8F0FF'], // Бирюзовый → Светлый голубой
  ['#FAD0C4', '#FFD3A5'], // Лососевый → Персиковый
];
export const useQRCode = () => {
  const generateQRCode = useCallback((data: string) => {
    const [color1, color2] =
      gradientColors[Math.floor(Math.random() * gradientColors.length)];

    return new QRCodeStyling({
      type: 'canvas',
      shape: 'square',
      width: 300,
      height: 300,
      data: data,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H',
      },
      imageOptions: {
        saveAsBlob: true,
        hideBackgroundDots: true,
        imageSize: 0.25,
        margin: 5,
      },
      dotsOptions: {
        type: 'square',
        roundSize: true,
        color: color1,
        gradient: {
          type: 'linear',
          rotation: Math.random() * Math.PI,
          colorStops: [
            { offset: 0, color: color1 },
            { offset: 1, color: color2 },
          ],
        },
      },
      backgroundOptions: {
        round: 0,
        color: '#ffffff',
      },
      cornersSquareOptions: {
        type: 'dot',
        color: '#000000',
        gradient: {
          type: 'linear',
          rotation: Math.random() * Math.PI,
          colorStops: [
            { offset: 0, color: color2 },
            { offset: 1, color: color1 },
          ],
        },
      },
      cornersDotOptions: {
        type: 'dot',
        color: color1,
      },
    });
  }, []);

  return { generateQRCode };
};
