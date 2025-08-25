import { Injectable } from '@nestjs/common';
import { add, isAfter, differenceInDays, differenceInHours, format, parseISO, subMonths, subDays, subYears } from 'date-fns';

@Injectable()
export class DateFnsService {
  private getIntervalFunction(intervalType: "D" | "M" | "A") {
    return (() => {
      switch (intervalType) {
        case "D":
          return subDays;
        case "M":
          return subMonths;
        case "A":
          return subYears;
      }
    })();
  }

  format(date: string, timeFormat: string) {
    const dateIso = parseISO(date);

    return format(dateIso, timeFormat);
  }

  isAfter(date: Date, expiration: Date) {
    return isAfter(date, expiration);
  }

  countDaysInMonths(countMonths: number, startsDay: Date | undefined = new Date()) {
    const futureDate = add(startsDay, { months: countMonths });
    const diffInDays = differenceInDays(startsDay, futureDate);

    return -1 * diffInDays;
  }

  getFormattedInterval(start: Date, totalCount: number, timeFormat: string, intervalType: "D" | "M" | "A") {
    const transform = this.getIntervalFunction(intervalType);

    return Array.from({ length: totalCount }, (_, index) => {
      const data = transform(start, index);

      format(data, timeFormat)
    });
  }
  
  formatRelativeTime(date: Date | string): string {
    const lastActivityDate = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();

    const diffHours = differenceInHours(now, lastActivityDate);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    const diffDays = differenceInDays(now, lastActivityDate);
    if (diffDays < 365) {
      return `${diffDays}d ago`;
    }

    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears}y ago`;
  }
}
