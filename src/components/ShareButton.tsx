import { useIsMobile } from '@/hooks/useIsMobile';
import { useShare } from '@/hooks/useShare';
import { Share } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from './ui/button';

interface ShareButtonProps {
  title?: string;
  text?: string;
  qrCode: QRCodeStyling | null;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title = 'Share',
  text = 'Check it out!',
  qrCode
}) => {
  const isMobile = useIsMobile();
  const { share, shareError } = useShare();

  const handleShare = async (): Promise<void> => {
    if (!qrCode) return;

    try {
      const blob = await qrCode.getRawData('png');
      if (!blob) return;
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      try {
        await share({
          title,
          text,
          url: window.location.href,
          files: [file]
        });
      } catch  {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          await share({
            title,
            text: `${text}\n\n${base64data}`,
            url: window.location.href
          });
        };
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isMobile)
    return (
      <div>
        <Button onClick={handleShare} variant="outline">
          <Share />
        </Button>
        {shareError && (
          <p className="error-message">Error: {shareError.message}</p>
        )}
      </div>
    );
};
