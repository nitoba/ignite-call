import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
  useToast,
} from '@nito-ui/react'
import { useMutation } from '@tanstack/react-query'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { createTimeIntervals } from '../../../services/create-time-invervals'
import { covertTimeStringToMinutes } from '../../../utils/convert-time-string-to-minutes'
import { getWeekDays } from '../../../utils/get-week-day'
import { Container, Header } from '../styles'
import {
  ErrorMessage,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from './styles'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana',
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: covertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: covertTimeStringToMinutes(interval.endTime),
      })),
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        ),
      { message: 'O horário deve ter no mínimo 1h de diferença' },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.infer<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const { showErrorMessage } = useToast()
  const { push } = useRouter()
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput>({
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
    resolver: zodResolver(timeIntervalsFormSchema),
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  const { mutateAsync } = useMutation<void, Error, TimeIntervalsFormOutput>(
    (data) => createTimeIntervals(data),
  )

  async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
    try {
      await mutateAsync(data, {
        onError(error) {
          showErrorMessage({ title: 'Error', description: error.message })
        },

        onSuccess() {
          push('/register/update-profile')
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <NextSeo
        title="Selecione seus horários disponíveis - Ignite Call"
        noindex
      />

      <Container>
        <Header>
          <Heading as="h1">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>
          <MultiStep size={4} currentStep={3} />
        </Header>

        <IntervalBox
          as="form"
          onSubmit={handleSubmit((data) =>
            handleSetTimeIntervals(data as unknown as TimeIntervalsFormOutput),
          )}
        >
          <IntervalContainer>
            {fields.map(({ id, weekDay }, index) => (
              <IntervalItem key={id}>
                <IntervalDay>
                  <Controller
                    control={control}
                    name={`intervals.${index}.enabled`}
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          onChange(checked === true)
                        }
                      />
                    )}
                  />
                  <Text>{weekDays[weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            ))}
          </IntervalContainer>
          <ErrorMessage>{errors.intervals?.message}</ErrorMessage>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </IntervalBox>
      </Container>
    </>
  )
}
