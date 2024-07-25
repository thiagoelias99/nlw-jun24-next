import { createTripDtoSchema } from '@/app/model/trip'
import { apiErrorHandler } from '@/utils/api-error-handler'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedBody = createTripDtoSchema.parse(body)

    console.log(parsedBody)

    return Response.json({ message: 'Created' }, { status: StatusCodes.CREATED })
  } catch (error) {
    return apiErrorHandler(error as Error)
  }
}