import Head from 'next/head'
import { Button, Heading, MultiStep, Text } from '@nito-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight } from 'phosphor-react'
import { ConnectBox, ConnectItem } from './styles'

export default function ConnectCalendar() {
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
          <MultiStep size={4} currentStep={2} />
        </Header>
        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            <Button variant="secondary" size="sm">
              Conectar
            </Button>
          </ConnectItem>
          <Button type="submit">
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
