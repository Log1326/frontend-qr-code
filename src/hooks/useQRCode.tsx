import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  ShapeType,
} from 'qr-code-styling';
import { useCallback } from 'react';

// Обновленные цветовые комбинации с высоким контрастом
const gradientColors: string[][] = [
  ['#000000', '#454545'], // Черный → Темно-серый
  ['#1a237e', '#534bae'], // Темно-синий → Синий
  ['#1b5e20', '#2e7d32'], // Темно-зеленый → Зеленый
  ['#311b92', '#512da8'], // Темно-фиолетовый → Фиолетовый
  ['#263238', '#455a64'], // Темно-серый → Серый
  ['#0D47A1', '#1976D2'], // Темно-синий → Синий
  ['#004D40', '#00796B'], // Темно-бирюзовый → Бирюзовый
  ['#1A237E', '#283593'], // Индиго темный → Индиго
  ['#880E4F', '#AD1457'], // Темно-розовый → Розовый
  ['#3E2723', '#5D4037'], // Темно-коричневый → Коричневый
];

const dotTypes: DotType[] = ['square', 'dots', 'rounded'];
const cornerDotTypes: CornerDotType[] = [
  'square',
  'dot',
  'classy',
  'classy-rounded',
  'dots',
  'rounded',
  'extra-rounded',
];
const cornerSquareTypes: CornerSquareType[] = ['square', 'extra-rounded'];
const shapes: ShapeType[] = ['circle'];

export const useQRCode = () => {
  const getRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };
  const generateQRCode = useCallback((data: string) => {
    const [color1, color2] = getRandomElement(gradientColors);
    const rotation = Math.PI / 4;
    return new QRCodeStyling({
      type: 'canvas',
      shape: getRandomElement(shapes),
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
        type: getRandomElement(dotTypes),
        color: color1,
        gradient: {
          type: 'linear',
          rotation,
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
        type: getRandomElement(cornerSquareTypes),
        color: color1,
      },
      cornersDotOptions: {
        type: getRandomElement(cornerDotTypes),
        color: color1,
      },
    });
  }, []);
  return { generateQRCode };
};
