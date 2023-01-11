import { Box, Heading, styled, Text } from '@nito-ui/react'

export const Container = styled('main', {
  maxWidth: 572,
  margin: '$20 auto $4',
  padding: '0 $4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

export const Header = styled('div', {
  padding: '0 $6',

  [`> ${Heading}`]: {
    lineHeight: '$base',
    color: '$white',
    fontSize: '$2xl',
  },

  [`> ${Text}`]: {
    color: '$gray200',
    marginBottom: '$6',
  },
})

export const Form = styled(Box, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  marginTop: '$6',
})

export const FormLabel = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const FormError = styled(Text, {
  fontSize: '$sm !important',
  color: '#DB4437 !important',
})
