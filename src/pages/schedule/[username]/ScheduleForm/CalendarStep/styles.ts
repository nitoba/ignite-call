import { Box, keyframes, styled, Text } from '@nito-ui/react'

const openTimePicker = keyframes({
  from: {
    opacity: 0,
    visibility: 'hidden',
  },
  to: {
    opacity: 1,
    visibility: 'visible',
  },
})

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: '0',
  display: 'grid',
  maxWidth: '100%',
  position: 'relative',

  variants: {
    isTimePickerOpen: {
      true: {
        gridTemplateColumns: '1fr 280px',
        '@media (max-width: 900px)': {
          gridTemplateColumns: '1fr',
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: '1fr',
      },
    },
  },
})

export const TimePicker = styled('div', {
  borderLeft: '1px solid $gray600',
  padding: '$6 $6 0',
  overflowY: 'scroll',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: 280,

  animation: `${openTimePicker} 400ms forwards`,
})
export const TimePickerHeader = styled(Text, {
  fontWeight: '$medium',
  span: {
    color: '$gray200',
  },
})
export const TimePickerList = styled('div', {
  marginTop: '$3',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',

  '@media (max-width:900px)': {
    gridTemplateColumns: '2fr',
  },
})
export const TimePickerItem = styled('button', {
  border: 0,
  backgroundColor: '$gray600',
  padding: '$2 0',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  lineHeight: '$base',
  transition: 'background 0.2s',

  '&:last-child': {
    marginBottom: '$6',
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:not(:disabled):focus': {
    boxShadow: '0 0 0 1px $colors$ignite300',
  },

  '&:disabled': {
    background: 'none',
    cursor: 'default',
    opacity: 0.4,
  },
})

export const TimePickerEmpty = styled('div', {
  textAlign: 'center',

  svg: {
    width: '$5',
    height: '$5',
    backgroundColor: '$gray600',
    borderRadius: '$sm',
    padding: '$1',
  },

  [`> ${Text}`]: {
    display: 'block',
    color: '$gray200',
  },
})
