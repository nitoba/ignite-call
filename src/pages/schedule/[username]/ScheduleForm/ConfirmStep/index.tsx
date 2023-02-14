import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput, useToast } from '@nito-ui/react'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  createScheduling,
  CreateScheduling,
} from '../../../../../services/create-scheduling'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter no mínimo 3 caracteres' }),
  email: z.string().email('Digite um email válido'),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

type ConfirmStepProps = {
  schedulingDate: Date
  onCancel: () => void
}

export function ConfirmStep({ schedulingDate, onCancel }: ConfirmStepProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const {
    query: { username },
  } = useRouter()

  const { showErrorMessage, showSuccessMessage } = useToast()

  const describeDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describeTime = dayjs(schedulingDate).format('HH:mm[h]')

  const { mutateAsync } = useMutation<void, Error, CreateScheduling>((data) =>
    createScheduling(data),
  )

  async function handleConfirmScheduling(data: ConfirmFormData) {
    try {
      await mutateAsync(
        { username: String(username), date: schedulingDate, ...data },
        {
          onError(error) {
            showErrorMessage({ title: 'Error', description: error.message })
          },

          onSuccess() {
            showSuccessMessage({
              title: 'Muito bem!',
              description: 'Seu agendamento foi realizado com sucesso',
            })
            // push(`/schedule/${username}`)
            onCancel()
          },
        },
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <CalendarBlank />
        <Text as="time">{describeDate}</Text>
        <Text>
          <Clock />
          {describeTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        <FormError>{errors.name?.message}</FormError>
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        <FormError>{errors.email?.message}</FormError>
      </label>

      <label>
        <Text size="sm">Obvervações</Text>
        <TextArea css={{ resize: 'none' }} {...register('observations')} />
      </label>

      <FormActions>
        <Button
          type="button"
          variant="tertiary"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
