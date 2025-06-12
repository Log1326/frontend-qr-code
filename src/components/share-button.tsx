import { Share } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ShareButtonProps {
  url: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url }) => {
  const isMobile = useIsMobile();

  const handleShare = async (): Promise<void> => {
    try {
      if (navigator.share) {
        await navigator
          .share({
            title: 'Ссылка',
            url,
          })
          .then(() => console.log('Share was successful.'))
          .catch((error) => console.log('Sharing failed', error));
      } else console.warn('Web Share API is not supported in this browser');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!isMobile) return null;

  return (
    <Button onClick={handleShare} variant="outline">
      <Share className="h-4 w-4" />
    </Button>
  );
};
