import cvData from '@/data/cv.json';
import type { CV } from '@/types/cv';

export function getCV(): CV {
  return cvData as CV;
}

export function getTelegramLink(telegram: string): string {
  const username = telegram.replace(/^@/, '');
  return `https://t.me/${username}`;
}

export function getTelLink(phone: string): string {
  return `tel:${phone.replace(/\s+/g, '')}`;
}

export function getMailtoLink(email: string): string {
  return `mailto:${email}`;
}
