import {
  SearchModel,
  SearchHotelParams
} from './search.model'

export const SearchService = {
  async searchHotels(
    params: SearchHotelParams
  ) {
    if (!params.destination.trim()) {
      throw new Error(
        'Vui lòng nhập địa điểm'
      )
    }

    if (!params.checkIn) {
      throw new Error(
        'Vui lòng chọn ngày nhận phòng'
      )
    }

    if (!params.checkOut) {
      throw new Error(
        'Vui lòng chọn ngày trả phòng'
      )
    }

    const checkIn =
      new Date(params.checkIn)

    const checkOut =
      new Date(params.checkOut)

    if (checkOut <= checkIn) {
      throw new Error(
        'Ngày trả phòng phải lớn hơn ngày nhận phòng'
      )
    }

    if (params.rooms < 1) {
      throw new Error(
        'Số phòng phải lớn hơn 0'
      )
    }

    if (params.adults < 1) {
      throw new Error(
        'Phải có ít nhất 1 người lớn'
      )
    }

    return await SearchModel.searchHotels(
      params
    )
  }
}