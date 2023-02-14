import { Button, Heading, MultiStep, Text, useToast } from '@nito-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NextSeo } from 'next-seo'

export default function ConnectCalendar() {
  const toast = useToast()
  const router = useRouter()
  const session = useSession()

  const isSignIn = session.status === 'authenticated'
  const hasAuthError = router.query.error === 'permissions'

  useEffect(() => {
    if (hasAuthError) {
      toast.showErrorMessage({
        title: 'Permissions',
        description:
          'Fail to connect with Google, verify if you enable permissions to access Google Calendar',
      })
    }
  }, [hasAuthError, toast])

  async function handleConnectCalendar() {
    signIn('google', { callbackUrl: '/register/connect-calendar' })
  }

  async function handleNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo title="Connecte-se sua agenda do Google - Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="h1">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={2} />
        </Header>
        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            {isSignIn ? (
              <Button variant="primary" size="sm">
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnectCalendar}
              >
                Conectar
              </Button>
            )}
          </ConnectItem>
          <Button disabled={!isSignIn} onClick={handleNextStep}>
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
