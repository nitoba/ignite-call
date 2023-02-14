import dayjs from 'dayjs'
import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'
import { z, ZodError } from 'zod'
import { getGoogleOAuthToken } from '../../../../lib/google'
import { prisma } from '../../../../lib/prisma'

const createScheduleSchemaBody = z.object({
  name: z.string(),
  email: z.string().email(),
  observations: z.string().nullable(),
  date: z.string().datetime(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end({ message: 'METHOD not supported' })
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return res.status(404).end({ message: 'User does not exists' })
  }

  try {
    const { name, email, observations, date } = createScheduleSchemaBody.parse(
      req.body,
    )

    const schedulingDate = dayjs(date).startOf('hour')

    if (schedulingDate.isBefore(new Date())) {
      return res.status(400).json({ message: 'Date is in the past.' })
    }

    const conflictingScheduling = await prisma.scheduling.findFirst({
      where: { user_id: user.id, date: schedulingDate.toDate() },
    })

    if (conflictingScheduling) {
      return res
        .status(403)
        .json({ message: 'A user already scheduling to this time' })
    }

    const scheduling = await prisma.scheduling.create({
      data: {
        name,
        email,
        observations,
        user_id: user.id,
        date: schedulingDate.toDate(),
      },
    })

    const calendar = google.calendar({
      version: 'v3',
      auth: await getGoogleOAuthToken(user.id),
    })

    await calendar.events.insert({
      calendarId: 'primary', // primary calendar, that will be used the default calendar of the user
      conferenceDataVersion: 1,
      requestBody: {
        summary: `Ignite Call: ${name}`,
        description: observations,
        start: {
          dateTime: schedulingDate.format(),
        },
        end: {
          dateTime: schedulingDate.add(1, 'hour').format(),
        },
        attendees: [{ email, displayName: name }],
        // Create a new meeting with Google Meet
        conferenceData: {
          createRequest: {
            requestId: scheduling.id,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      },
    })

    return res.status(201).end()
  } catch (error: any) {
    console.error(error)

    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(500).json({ message: error.message })
  }
}
