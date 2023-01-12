import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { username, name } = req.body

  const userExists = await prisma.user.findUnique({ where: { username } })

  if (userExists) {
    return res
      .status(409)
      .json({ message: 'This user already exists with this username' })
  }

  const user = await prisma.user.create({ data: { name, username } })

  return res.status(201).json(user)
}
