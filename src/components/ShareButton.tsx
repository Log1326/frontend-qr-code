import { useIsMobile } from '@/hooks/useIsMobile';
import { useShare } from '@/hooks/useShare';
import { fileToBase64 } from '@/lib/fileToBase64';
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
  qrCode,
}) => {
  const isMobile = useIsMobile();
  const { share, shareError } = useShare();

  const handleShare = async (): Promise<void> => {
    const shareData = {
      title,
      text,
      url: window.location.href,
    };

    if (qrCode) {
      try {
        const blob = await qrCode.getRawData('png');
        if (blob) {
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });
          const base64Image = await fileToBase64(file);
          shareData.text = `${text}\n\n${base64Image}`;
        }
      } catch (error) {
        console.error('Error preparing image for share:', error);
      }
    }
    await share(shareData);
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
