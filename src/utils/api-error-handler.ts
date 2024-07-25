import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

export function apiErrorHandler(error: Error) {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: error.format()
      },
      {
        status: StatusCodes.BAD_REQUEST
      })
  } else if (error instanceof SyntaxError) {
    return Response.json(
      {
        error: 'Invalid JSON'
      },
      {
        status: StatusCodes.BAD_REQUEST
      })
  } else {
    console.error(error)
    return Response.json(
      {
        error: 'Internal Server Error'
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
  }
}