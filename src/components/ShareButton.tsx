import { useIsMobile } from '@/hooks/useIsMobile';
import { Share } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from './ui/button';

interface ShareButtonProps {
  qrCode: QRCodeStyling | null;
  url: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ qrCode, url }) => {
  const isMobile = useIsMobile();

  const handleShare = async (): Promise<void> => {
    if (!qrCode) return;
    try {
      const blob = await qrCode.getRawData('png');
      if (!blob) return;
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      const filesArray = [file];
      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator
          .share({
            files: filesArray,
            title: 'QR Code',
            url,
          })
          .then(() => console.log('Share was successful.'))
          .catch((error) => console.log('Sharing failed', error));
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isMobile) {
    return (
      <Button onClick={handleShare} variant="outline">
        <Share />
      </Button>
    );
  }
  return null;
};
