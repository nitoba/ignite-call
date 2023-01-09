import { Roboto } from '@next/font/google'
import { globalCss } from '@nito-ui/react'
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },

  body: {
    fontFamily: `${roboto.style.fontFamily}, sans-serif`,
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})
