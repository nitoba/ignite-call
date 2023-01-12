import { AxiosError } from 'axios'
import { api } from '../lib/axios'

type RegisterUserParams = {
  name: string
  username: string
}

export async function registerUser(user: RegisterUserParams) {
  try {
    const { data } = await api.post('/users', { ...user })
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message)
    }
  }
}
