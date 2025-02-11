import { useIsMobile } from '@/hooks/useIsMobile';
import { useShare } from '@/hooks/useShare';
import { Share } from 'lucide-react';
import { Button } from './ui/button';

interface ShareButtonProps {
  title?: string;
  text?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title = 'Share',
  text = 'Check it out!',
}) => {
  const isMobile = useIsMobile();
  const { share, shareError } = useShare();

  const handleShare = async (): Promise<void> => {
    const shareData = {
      title,
      text,
      url: window.location.href
    };
  await share(shareData);
  };
if(isMobile)
  return (
    <div>
      <Button
        onClick={handleShare}
        variant='outline'
      >
        <Share />
      </Button>
      {shareError && <p className="error-message">Error: {shareError.message}</p>}
    </div>
  );
};
