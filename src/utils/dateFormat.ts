import moment from 'moment'

export const dateFormatFull = (date?: string) => (date ? moment(date).format('DD.MM.yyyy / HH:mm') : ' - ')

export const dateFormatShort = (date?: string) => (date ? moment(date).format('DD.MM.yyyy') : ' - ')

export const DATE_FORMAT_ISO8601 = 'YYYY-MM-DDTHH:mm:ssZ'
export const DATE_FORMAT_ISO8601_SHORT = 'YYYY-MM-DD'
