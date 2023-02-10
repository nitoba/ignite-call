import { Box, styled, Text } from '@nito-ui/react'

export const ConfirmForm = styled(Box, {
  maxWidth: 540,
  margin: '$6 auto 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  },
})
export const FormHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',

  paddingBottom: '$6',
  marginBottom: '$2',
  borderBottom: '1px solid $gray600',

  [`> ${Text}`]: {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',

    svg: {
      width: '$5',
      height: '$5',
      color: '$gray200',
    },
  },
})
export const FormError = styled(Text, {
  fontSize: '$sm !important',
  color: '#DB4437 !important',
})
export const FormActions = styled('div', {
  display: 'flex',
  gap: '$2',
  justifyContent: 'flex-end',
})
