import { useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const selectedWeekDay = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
  }).format(selectedDate!)

  const selectedMonth = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(selectedDate!)

  const isSelectedDate = !!selectedDate

  return (
    <Container isTimePickerOpen={isSelectedDate}>
      <Calendar onDateSelected={setSelectedDate} selectedDate={selectedDate} />

      {selectedDate && (
        <TimePicker>
          <TimePickerHeader>
            {selectedWeekDay}{' '}
            <span>
              {selectedDate.getDate()} de {selectedMonth}
            </span>
          </TimePickerHeader>

          <TimePickerList>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>09:00h</TimePickerItem>
            <TimePickerItem>10:00h</TimePickerItem>
            <TimePickerItem>11:00h</TimePickerItem>
            <TimePickerItem>12:00h</TimePickerItem>
            <TimePickerItem>13:00h</TimePickerItem>
            <TimePickerItem>14:00h</TimePickerItem>
            <TimePickerItem>15:00h</TimePickerItem>
            <TimePickerItem>16:00h</TimePickerItem>
            <TimePickerItem>17:00h</TimePickerItem>
            <TimePickerItem>18:00h</TimePickerItem>
            <TimePickerItem>19:00h</TimePickerItem>
            <TimePickerItem>20:00h</TimePickerItem>
            <TimePickerItem>21:00h</TimePickerItem>
            <TimePickerItem>22:00h</TimePickerItem>
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
