import { Button, Heading, MultiStep, Text, TextInput } from '@nito-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Container, Form, FormError, FormLabel, Header } from './styles'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../../services/register-user'
import Head from 'next/head'

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

  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(3, 'Name must be at least 3 characters'),
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const { mutateAsync } = useMutation<void, unknown, RegisterFormData>((data) =>
    registerUser(data),
  )

  async function handleRegister({ username, name }: RegisterFormData) {
    try {
      await mutateAsync(
        { username, name },
        {
          onSettled(data, error: any) {
            if (error) {
              return setError('username', { message: error.message })
            }
          },
        },
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (username) setValue('username', String(username))
  }, [username, setValue])

  return (
    <>
      <Head>
        <title>Register Step 1 - Ignite Call</title>
      </Head>
      <Container>
        <Header>
          <Heading as="h1">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
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
              {...register('name')}
            />
            <FormError>{errors.name?.message}</FormError>
          </FormLabel>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
