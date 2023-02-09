import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
  useToast,
} from '@nito-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Container, FormLabel, Header } from '../styles'
import { useMutation } from '@tanstack/react-query'
import Head from 'next/head'
import { FormAnnotation, ProfileBox } from './styles'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { useSession } from 'next-auth/react'
import { updateUserProfile } from '../../../services/update-user-profile'
import { useRouter } from 'next/router'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const toast = useToast()
  const { push } = useRouter()
  const session = useSession()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const { mutateAsync } = useMutation<void, unknown, UpdateProfileFormData>(
    ({ bio }) => updateUserProfile(bio),
  )

  async function handleUpdateProfile({ bio }: UpdateProfileFormData) {
    try {
      await mutateAsync(
        { bio },
        {
          onError(error: any) {
            toast.showErrorMessage({
              title: 'Error',
              description: error.message,
            })
          },
          onSuccess() {
            push(`/schedule/${session.data?.user.username}`)
          },
        },
      )
    } catch (error) {
      console.log(error)
    }
  }

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
          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <FormLabel>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </FormLabel>

          <FormLabel>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} css={{ resize: 'none' }} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal
            </FormAnnotation>
          </FormLabel>

          <Button type="submit" disabled={isSubmitting}>
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  return {
    props: { session },
  }
}
