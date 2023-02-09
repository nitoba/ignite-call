import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { z, ZodError } from 'zod'
import { prisma } from '../../../lib/prisma'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) return res.status(401).json({ message: 'Unauthorized user' })

  try {
    const { bio } = updateProfileBodySchema.parse(req.body)

    await prisma.user.update({ where: { id: session.user.id }, data: { bio } })

    return res.status(204).end()
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(500).json({ message: error.message })
  }
}
