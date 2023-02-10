import dayjs, { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { getWeekDays } from '../../../utils/get-week-day'

type CalendarWeek = {
  week: number
  days: {
    date: Dayjs
    disabled: boolean
  }[]
}

type CalendarWeeks = CalendarWeek[]

type UseCalendarProps = {
  currentMonth: string
  currentYear: string
  weekDays: string[]
  handlePreviousMonth: () => void
  handleNextMonth: () => void
  calendarWeeks: CalendarWeeks
}

type UseCalendarInputProps = {
  defaultDate: Date | null
}

export function useCalendar(props?: UseCalendarInputProps): UseCalendarProps {
  const [currentDate, setCurrentDate] = useState(() => {
    if (props?.defaultDate) {
      return dayjs(props?.defaultDate).set('date', 1)
    } else {
      return dayjs().set('date', 1)
    }
  })

  const weekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => currentDate.set('date', i + 1))

    const firstWeekDay = currentDate.get('day')

    const previousMonthArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => currentDate.subtract(i + 1, 'day'))
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => lastDayInCurrentMonth.add(i + 1, 'day'))

    const calendarDays = [
      ...previousMonthArray.map((date) => ({ date, disabled: true })),
      ...daysInMonthArray.map((date) => ({
        date,
        disabled: date.endOf('day').isBefore(new Date()),
      })),
      ...nextMonthFillArray.map((date) => ({ date, disabled: true })),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({ week: i / 7 + 1, days: original.slice(i, i + 7) })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate])

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const previousMonthDate = currentDate.add(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  return {
    calendarWeeks,
    currentMonth,
    currentYear,
    weekDays,
    handleNextMonth,
    handlePreviousMonth,
  }
}
