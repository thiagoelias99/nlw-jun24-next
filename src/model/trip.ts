import { z } from '@/lib/pt-zod'
import { fireStore } from '@/services/firebase'
import { getMailClient } from '@/services/mail'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import nodemailer from 'nodemailer'

export interface ITripGuests {
  email: string
  name: string
  isConfirmed: boolean
}

export interface ITrip {
  id: string
  destination: string
  startsAt: Date
  endsAt: Date
  ownerName: string
  ownerEmail: string
  isConfirmed: boolean
  guests: ITripGuests[]
  links: []
  activities: []
}

export const createTripDtoSchema = z.object({
  destination: z.string().min(1),
  startAt: z.union([
    z.string().date().transform((data) => new Date(data)),
    z.string().datetime().transform((data) => new Date(data)),
    z.date(),
  ]),
  endsAt: z.union([
    z.string({ required_error: 'Data de término é obrigatória' }).date().transform((data) => new Date(data)),
    z.string({ required_error: 'Data de término é obrigatória' }).datetime().transform((data) => new Date(data)),
    z.date({ required_error: 'Data de término é obrigatória' }),
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

export class Trip implements ITrip {
  id: string
  destination: string
  startsAt: Date
  endsAt: Date
  ownerName: string
  ownerEmail: string
  isConfirmed: boolean
  guests: ITripGuests[]
  links: []
  activities: []

  constructor(data: ITrip) {
    Object.assign(this, data)
  }

  static async fromFirestore(tripId: string): Promise<Trip | undefined> {
    const tripDoc = doc(fireStore, 'trips', tripId)
    const tripSnapshot = await getDoc(tripDoc)

    if (tripSnapshot.exists()) {
      const trip = new Trip({
        id: tripSnapshot.id,
        destination: tripSnapshot.data().destination,
        startsAt: tripSnapshot.data().starts_at.toDate(),
        endsAt: tripSnapshot.data().ends_at.toDate(),
        ownerName: tripSnapshot.data().owner_name,
        ownerEmail: tripSnapshot.data().owner_email,
        isConfirmed: tripSnapshot.data().confirmed,
        guests: [],
        links: [],
        activities: []
      })

      const guestsDocs = await getDocs(collection(fireStore, 'trips', tripId, 'guests'))
      trip.guests = guestsDocs.docs.map((guest) => {
        return {
          email: guest.data().email,
          name: guest.data().name,
          isConfirmed: guest.data().is_confirmed
        }
      })

      // const linksDocs = await getDocs(collection(fireStore, 'trips', tripId, 'links'))
      // trip.links = linksDocs.docs.map((link) => {
      //   return {
      //     id: link.id,
      //     title: link.data().title,
      //     url: link.data().url
      //   }
      // })

      // const activitiesDocs = await getDocs(collection(fireStore, 'trips', tripId, 'activities'))
      // trip.activities = activitiesDocs.docs.map((activity) => {
      //   return {
      //     id: activity.id,
      //     title: activity.data().title,
      //     dateTime: activity.data().dateTime.toDate(),
      //     finished: activity.data().finished
      //   }
      // })

      return trip
    } else {
      return undefined
    }
  }

  static async createTrip(data: CreateTripDto) {
    const guests = data.guestToInvite || []
    delete data.guestToInvite

    const docRef = await addDoc(collection(fireStore, 'trips'), {
      ...data,
      confirmed: false
    })

    for (const guest of guests) {
      await addDoc(collection(fireStore, 'trips', docRef.id, 'guests'), {
        ...guest,
        isConfirmed: false
      })
    }

    // const mail = await getMailClient()

    // const message = await mail.sendMail({
    //   from: {
    //     name: 'Equipe planner',
    //     address: 'planner@email.com'
    //   },
    //   to: {
    //     name: data.ownerName,
    //     address: data.ownerEmail
    //   },
    //   subject: 'Nova viagem criada',
    //   html: `
    //     <h1>Viagem para ${data.destination} criada com sucesso</h1>
    //     <p>Olá, uma nova viagem foi criada com sucesso!</p>
    //     <p>Confira os detalhes:</p>
    //     <ul>
    //       <li>Destino: ${data.destination}</li>
    //       <li>Início: ${data.startAt}</li>
    //       <li>Fim: ${data.endsAt}</li>
    //     </ul>
    //     <p>Para confirmar sua presença, clique no link abaixo:</p>
    //     <a href="http://localhost:3000/api/trips/${docRef.id}/confirm">Confirmar trip</a>
    //     `
    // })

    // const testURL = nodemailer.getTestMessageUrl(message)

    // console.log('Preview URL: %s', testURL)

    return docRef.id
  }

  // static async createLink(data: ICreateLinkDto) {
  //   return addDoc(collection(fireStore, 'trips', data.tripId, 'links'), {
  //     title: data.title,
  //     url: data.url
  //   })
  // }

  // static async updateLink(data: IUpdateLinkDto) {
  //   const document = doc(fireStore, 'trips', data.tripId, 'links', data.linkId)

  //   return setDoc(document, {
  //     title: data.title,
  //     url: data.url
  //   })
  // }

  // static async deleteLink(data: IUpdateLinkDto) {
  //   const document = doc(fireStore, 'trips', data.tripId, 'links', data.linkId)

  //   return deleteDoc(document)
  // }

  // static async createActivity(data: ICreateActivityDto) {
  //   return addDoc(collection(fireStore, 'trips', data.tripId, 'activities'), {
  //     title: data.title,
  //     dateTime: data.dateTime,
  //     finished: false
  //   })
  // }

  // static async updateActivity(data: IUpdateActivityDto) {
  //   const document = doc(fireStore, 'trips', data.tripId, 'activities', data.activityId)

  //   return setDoc(document, {
  //     title: data.title,
  //     dateTime: data.dateTime
  //   })
  // }

  // static async deleteActivity(data: IUpdateActivityDto) {
  //   const document = doc(fireStore, 'trips', data.tripId, 'activities', data.activityId)

  //   return deleteDoc(document)
  // }
}