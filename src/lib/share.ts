export const isShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share;
};
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
};
