import { HotelImageModel } from './hotelImage.model';

export const getHotelImages = async (
  hotelId: number
) => {

  return await HotelImageModel.findByHotelId(
    hotelId
  );
};


export const getHotelImage = async (
  id: number
) => {

  const image =
    await HotelImageModel.findById(id);

  if (!image) {
    throw new Error(
      'Không tìm thấy hình ảnh'
    );
  }

  return image;
};


export const createHotelImage = async (
  hotelId: number,
  imageUrl: string,
  isPrimary: boolean = false
) => {

  if (!imageUrl) {
    throw new Error(
      'image_url không được để trống'
    );
  }

  return await HotelImageModel.create({
    hotel_id: hotelId,
    image_url: imageUrl,
    is_primary: isPrimary
  });
};


export const setPrimaryImage = async (
  id: number
) => {

  const image =
    await HotelImageModel.setPrimary(id);

  if (!image) {
    throw new Error(
      'Không tìm thấy hình ảnh'
    );
  }

  return image;
};


export const deleteHotelImage = async (
  id: number
) => {

  const image =
    await HotelImageModel.delete(id);

  if (!image) {
    throw new Error(
      'Không tìm thấy hình ảnh'
    );
  }

  return image;
};