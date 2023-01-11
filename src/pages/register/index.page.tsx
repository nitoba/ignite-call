import { Button, Heading, MultiStep, Text, TextInput } from '@nito-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Container, Form, FormError, FormLabel, Header } from './styles'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const registerSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(5, 'Username must be at least 5 characters')
    .regex(
      /^([a-z\\-]+)$/i,
      'username must be contains only letters and hyphen',
    )
    .transform((username) => username.toLowerCase()),

  fullName: z
    .string({
      required_error: 'FullName is required',
      invalid_type_error: 'FullName must be a string',
    })
    .min(3, 'FullName must be at least 3 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const {
    query: { username },
  } = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  function handleRegister(data: RegisterFormData) {}

  useEffect(() => {
    if (username) setValue('username', String(username))
  }, [username, setValue])

  return (
    <Container>
      <Header>
        <Heading as="h1">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <FormLabel>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuário"
            {...register('username')}
          />
          <FormError>{errors.username?.message}</FormError>
        </FormLabel>

        <FormLabel>
          <Text size="sm">Nome completo</Text>
          <TextInput
            placeholder="digite seu nome completo"
            {...register('fullName')}
          />
          <FormError>{errors.fullName?.message}</FormError>
        </FormLabel>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
