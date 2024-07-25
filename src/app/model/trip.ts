import { z } from 'zod'

export interface ITrip {
  id: string
  destination: string
  startsAt: Date
  endsAt: Date
  ownerName: string
  ownerEmail: string
  isConfirmed: boolean
  guests: []
  links: []
  activities: []
}

export const createTripDtoSchema = z.object({
  destination: z.string().min(1),
  startAt: z.union([
    z.string().date().transform((data) => new Date(data)),
    z.string().datetime().transform((data) => new Date(data)),
  ]),
  endsAt: z.union([
    z.string().date().transform((data) => new Date(data)),
    z.string().datetime().transform((data) => new Date(data)),
  ]),
  ownerName: z.string().min(1),
  ownerEmail: z.string().email(),
  guestToInvite: z.array(z.object(
    {
      name: z.string().min(1),
      email: z.string().email(),
    })).optional(),
})

export type CreateTripDto = z.infer<typeof createTripDtoSchema>