import { Avatar, Heading, Text } from '@nito-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import { Container, UserHeader } from './styles'

type ScheduleProps = {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Container
        css={{
          display: 'grid',
          placeContent: 'center',
        }}
      >
        <Heading>Getting Information About This User</Heading>
      </Container>
    )
  }

  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} alt={user.name}></Avatar>
        <Heading>{user.name}</Heading>
        <Text size="sm">{user.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = params?.username as string

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return {
      notFound: true,
    }
  }

  console.log(user)

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
