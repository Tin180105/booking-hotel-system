import sql from 'mssql'
import { getConnection } from '../../config/database'

export interface SearchHotelParams {
  destination: string
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children: number
}

export const SearchModel = {
  async searchHotels(params: SearchHotelParams) {
    const pool = await getConnection()

    const totalGuests =
      params.adults + params.children

    const result = await pool
      .request()
      .input(
        'destination',
        sql.NVarChar(100),
        `%${params.destination}%`
      )
      .input(
        'checkIn',
        sql.DateTime2,
        params.checkIn
      )
      .input(
        'checkOut',
        sql.DateTime2,
        params.checkOut
      )
      .input(
        'rooms',
        sql.Int,
        params.rooms
      )
      .input(
        'totalGuests',
        sql.Int,
        totalGuests
      )
      .query(`
        SELECT
          h.id AS hotel_id,
          h.name AS hotel_name,
          h.city,
          h.address,
          h.description,
          h.star_rating,

          MIN(rt.base_price) AS min_price,

          (
            SELECT TOP 1 hi.image_url
            FROM hotel_images hi
            WHERE hi.hotel_id = h.id
            ORDER BY hi.is_primary DESC
          ) AS image_url

        FROM hotels h

        INNER JOIN room_types rt
          ON rt.hotel_id = h.id

        WHERE

          h.status = 'ACTIVE'

          AND (
            h.city LIKE @destination
            OR h.name LIKE @destination
          )

          AND rt.capacity >= @totalGuests

          AND
          (
            rt.total_rooms -

            ISNULL(
              (
                SELECT SUM(br.quantity)

                FROM booking_rooms br

                INNER JOIN bookings b
                  ON b.id = br.booking_id

                WHERE
                  br.room_type_id = rt.id

                  AND br.expected_check_in < @checkOut

                  AND br.expected_check_out > @checkIn

                  AND b.status NOT IN (
                    'CANCELLED',
                    'REJECTED'
                  )
              ),
              0
            )

          ) >= @rooms

        GROUP BY
          h.id,
          h.name,
          h.city,
          h.address,
          h.description,
          h.star_rating

        ORDER BY
          min_price ASC
      `)

    return result.recordset
  }
}