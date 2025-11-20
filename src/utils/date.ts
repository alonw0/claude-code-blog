import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

export function formatDateShort(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
