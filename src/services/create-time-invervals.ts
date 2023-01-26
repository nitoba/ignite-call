import { AxiosError } from 'axios'
import { api } from '../lib/axios'
type TimeIntervals = {
  intervals: {
    weekDay: number
    startTimeInMinutes: number
    endTimeInMinutes: number
  }[]
}
export async function createTimeIntervals({ intervals }: TimeIntervals) {
  try {
    await api.post('/users/time-intervals', { intervals })
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message)
    }
  }
}
