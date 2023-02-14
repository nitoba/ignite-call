import { AxiosError } from 'axios'
import { api } from '../lib/axios'

export type CreateScheduling = {
  username: string
  name: string
  email: string
  observations: string | null
  date: Date
}

export async function createScheduling({
  username,
  name,
  email,
  observations,
  date,
}: CreateScheduling) {
  try {
    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date,
    })
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message)
    }
  }
}
