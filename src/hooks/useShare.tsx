import { useState } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url: string;
  files?: File[];
}

interface ShareResult {
  share: (data: ShareData) => Promise<boolean>;
  shareError: Error | null;
}

export const useShare = (): ShareResult => {
  const [shareError, setShareError] = useState<Error | null>(null);

  const share = async (data: ShareData): Promise<boolean> => {
    setShareError(null);

    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown sharing error');
        setShareError(err);
        return false;
      }
    } else {
      try {
        await navigator.clipboard.writeText(data.url);
        return true;
      } catch (error) {
        const err = new Error('Sharing is not supported on this device' + error);
        setShareError(err);
        return false;
      }
    }
  };

  return { share, shareError };
};
