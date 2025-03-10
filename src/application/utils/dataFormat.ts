import { format, isThisWeek, isToday, parseISO } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'

export const dateFormat = (date: string, locale: 'en' | 'ru') => {
  if (!date) {
    return
  }

  const parseDate = parseISO(date)
  const currentLocale = locale === 'en' ? enUS : ru

  if (isToday(parseDate)) {
    return format(parseDate, 'HH:mm')
  }

  if (isThisWeek(parseDate, { weekStartsOn: 1 })) {
    return format(parseDate, 'EE', { locale: currentLocale })
  }

  return format(parseDate, 'dd MMMM', { locale: currentLocale })
}
