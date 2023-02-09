import { api } from '../lib/axios'

export async function updateUserProfile(bio: string) {
  await api.put('/users/profile', {
    bio,
  })
}
