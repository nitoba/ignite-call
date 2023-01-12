import { Heading, Text } from '@nito-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { Container, Hero, Preview } from './styles'

import previewImage from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <>
      <Head>
        <title>Ignite Call</title>
      </Head>
      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Agendamento descomplicado
          </Heading>
          <Text as="span" size="lg">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>
          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            style={{ borderRadius: '8px' }}
            height={400}
            quality={100}
            priority
            alt="Calendar Preview"
          />
        </Preview>
      </Container>
    </>
  )
}
