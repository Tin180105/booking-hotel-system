import {
  Request,
  Response
} from 'express'

import {
  SearchService
} from './search.service'

export const SearchController = {
  async searchHotels(
    req: Request,
    res: Response
  ) {
    try {

      const {
        destination,
        checkIn,
        checkOut,
        rooms,
        adults,
        children
      } = req.query

      const data =
        await SearchService.searchHotels({
          destination:
            String(destination || ''),

          checkIn:
            String(checkIn || ''),

          checkOut:
            String(checkOut || ''),

          rooms:
            Number(rooms),

          adults:
            Number(adults),

          children:
            Number(children)
        })

      return res.status(200).json({
        success: true,
        data
      })

    } catch (error) {

      return res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra'
      })
    }
  }
}