import dayjs from 'dayjs'
import { api } from '../lib/axios'

type GetUserAvailableTimesResponse = {
  possibleTimes: number[]
  availableTimes: number[]
}

export async function getUserAvailableTimes(username: string, date: Date) {
  const { data } = await api.get<GetUserAvailableTimesResponse>(
    `/users/${username}/availability`,
    {
      params: { date: dayjs(date).format('YYYY-MM-DD') },
    },
  )

  return data
}
