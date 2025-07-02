import { useState } from 'react';

export const useClipboard = (
  timeout: number = 2000,
): {
  copy: (text: string) => Promise<void>;
  copied: boolean;
} => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
    }
  };

  return { copy, copied };
};
