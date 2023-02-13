import { CaretLeft, CaretRight } from 'phosphor-react'
import { Text } from '@nito-ui/react'
import { useCalendar } from './hooks/useCalendar'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

type CalendarProps = {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const {
    currentMonth,
    currentYear,
    weekDays,
    calendarWeeks,
    handleNextMonth,
    handlePreviousMonth,
    isLoadingCalendar,
  } = useCalendar({ defaultDate: selectedDate })

  if (isLoadingCalendar) {
    return (
      <CalendarContainer>
        <Text css={{ textAlign: 'center' }}>Loading calendar...</Text>
      </CalendarContainer>
    )
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous Month">
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth} title="Next Month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {weekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        disabled={disabled}
                        onClick={() => onDateSelected(date.toDate())}
                      >
                        {date.date()}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
