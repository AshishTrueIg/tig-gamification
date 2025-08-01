import DayJs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekday from 'dayjs/plugin/weekday'
import isoWeek from 'dayjs/plugin/isoWeek'

DayJs.extend(utc)
DayJs.extend(timezone)
DayJs.extend(weekday)
DayJs.extend(isoWeek)

export const dayjs = DayJs
export const serverDayjs = DayJs.utc
