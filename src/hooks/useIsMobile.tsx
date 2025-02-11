import { useEffect, useState } from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = (): void => {
      const userAgent: string = navigator.userAgent.toLowerCase();
      const mobileDevices: RegExp = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

      setIsMobile(mobileDevices.test(userAgent));
    };

    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobile;
};
