import { Text } from '@nito-ui/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { X } from 'phosphor-react'
import { useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import { getUserAvailableTimes } from '../../../../../services/get-user-available-times'
import {
  Container,
  TimePicker,
  TimePickerEmpty,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

type CalendarStepProps = {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const {
    query: { username },
  } = useRouter()

  const selectedWeekDay = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
  }).format(selectedDate!)

  const selectedMonth = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(selectedDate!)

  const isSelectedDate = !!selectedDate

  const { data, isFetching, isLoading, isRefetching } = useQuery(
    ['user-available-times', selectedDate, username],
    () => getUserAvailableTimes(String(username), selectedDate!),
    { enabled: !!selectedDate },
  )

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()
    onSelectDateTime(dateWithTime)
  }

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
            {isFetching || isLoading || isRefetching ? (
              <TimePickerEmpty>
                <Text>Loading...</Text>
              </TimePickerEmpty>
            ) : (
              <>
                {data?.availableTimes.length === 0 &&
                  data?.availableTimes.length === 0 && (
                    <TimePickerEmpty>
                      <X />
                      <Text size="sm">
                        Desculpe, nenhum horário disponível para hoje
                      </Text>
                    </TimePickerEmpty>
                  )}

                {data?.possibleTimes.map((possibleTime) => {
                  return (
                    <TimePickerItem
                      key={possibleTime}
                      disabled={!data.availableTimes.includes(possibleTime)}
                      onClick={() => handleSelectTime(possibleTime)}
                    >
                      {String(possibleTime).padStart(2, '0')}:00h
                    </TimePickerItem>
                  )
                })}
              </>
            )}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
