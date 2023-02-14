import { api } from '../lib/axios'

type GetBlockedDatesResponse = {
  blockedWeekDays: number[]
  blockedDates: number[]
}

type GetBlockedDatesParams = {
  username: string
  year: number
  month: number
}

export async function getBlockedDates({
  username,
  year,
  month,
}: GetBlockedDatesParams) {
  const { data } = await api.get<GetBlockedDatesResponse>(
    `/users/${username}/blocked-dates`,
    {
      params: { year, month: String(month + 1).padStart(2, '0') },
    },
  )

  return data
}
