import { createTripDtoSchema, Trip } from '@/model/trip'
import { apiErrorHandler } from '@/lib/api-error-handler'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'
import { getMailClient } from '@/services/mail'
import nodemailer from 'nodemailer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedBody = createTripDtoSchema.parse(body)

    const id = await Trip.createTrip(parsedBody)

    const mail = await getMailClient()

    const message = await mail.sendMail({
      from: {
        name: 'Equipe planner',
        address: 'planner@email.com'
      },
      to: {
        name: parsedBody.ownerName,
        address: parsedBody.ownerEmail
      },
      subject: 'Nova viagem criada',
      html: `
        <h1>Viagem para ${parsedBody.destination} criada com sucesso</h1>
        <p>Olá, uma nova viagem foi criada com sucesso!</p>
        <p>Confira os detalhes:</p>
        <ul>
          <li>Destino: ${parsedBody.destination}</li>
          <li>Início: ${format(parsedBody.startAt, "dd 'de' LLL y", { locale: ptBR })}</li>
          <li>Fim: ${format(parsedBody.endsAt, "dd 'de' LLL y", { locale: ptBR })}</li>
        </ul>
        <p>Para confirmar sua presença, clique no link abaixo:</p>
        <a href="http://localhost:3000/api/trips/${id}/confirm">Confirmar trip</a>
        `
    })

    const testURL = nodemailer.getTestMessageUrl(message)

    console.log('Preview URL: %s', testURL)

    return Response.json({ message: 'Created', id }, { status: StatusCodes.CREATED })
  } catch (error) {
    return apiErrorHandler(error as Error)
  }
}