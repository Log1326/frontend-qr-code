import QRCodeStyling from 'qr-code-styling';
import { useCallback } from 'react';

const houseIcons: string[] = [
  '/images/house-1.svg',
  '/images/house-2.svg',
  '/images/house-3.svg',
  '/images/house-4.svg',
  '/images/house-5.svg',
  '/images/house-6.svg',
  '/images/house-7.svg',
  '/images/house-8.svg',
  '/images/house-9.svg',
  '/images/house-10.svg',
  '/images/house-11.svg',
  '/images/house-12.svg',
  '/images/house-13.svg',
  '/images/house-14.svg',
  '/images/house-15.svg',
  '/images/house-16.svg',
  '/images/house-17.svg',
  '/images/house-18.svg',
];

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
    const randomHouse =
      houseIcons[Math.floor(Math.random() * houseIcons.length)];
    const [color1, color2] =
      gradientColors[Math.floor(Math.random() * gradientColors.length)];

    return new QRCodeStyling({
      type: 'canvas',
      shape: 'square',
      width: 400,
      height: 400,
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
      image: randomHouse,
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
