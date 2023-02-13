import axios from 'axios'
import dayjs from 'dayjs'

type GetUserAvailableTimesResponse = {
  possibleTimes: number[]
  availableTimes: number[]
}

export async function getUserAvailableTimes(username: string, date: Date) {
  const { data } = await axios.get<GetUserAvailableTimesResponse>(
    `/api/users/${username}/availability`,
    {
      params: { date: dayjs(date).format('YYYY-MM-DD') },
    },
  )

  return data
}
