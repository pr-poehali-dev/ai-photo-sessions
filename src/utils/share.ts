export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export async function shareImage(imageUrl: string, title: string = 'Создано в PhotoSet AI'): Promise<boolean> {
  try {
    if (navigator.share) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'photoset-ai.png', { type: 'image/png' });
      
      await navigator.share({
        title,
        text: 'Посмотрите на это изображение, созданное в PhotoSet AI!',
        files: [file]
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Native share failed:', error);
    return false;
  }
}

export async function copyImageToClipboard(imageUrl: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) {
      return false;
    }

    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
    
    return true;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
}

export function getShareUrl(platform: string, data: { url: string; text: string; imageUrl?: string }): string {
  const { url, text, imageUrl } = data;
  
  const urls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}${imageUrl ? `&image=${encodeURIComponent(imageUrl)}` : ''}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}${imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''}&description=${encodeURIComponent(text)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
  };
  
  return urls[platform] || url;
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

export function canCopyToClipboard(): boolean {
  return typeof navigator !== 'undefined' && 'clipboard' in navigator;
}
