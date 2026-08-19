import {
  Request,
  Response
} from 'express';

import {
  getHotelImages,
  getHotelImage,
  createHotelImage,
  setPrimaryImage,
  deleteHotelImage
} from './hotelImage.service';


// ========================================
// GET HOTEL IMAGES
// ========================================

export const getImages = async (
  req: Request,
  res: Response
) => {

  try {

    const hotelId =
      Number(req.params.hotelId);

    if (!hotelId) {
      return res.status(400).json({
        status: 'error',
        message: 'hotelId không hợp lệ'
      });
    }

    const images =
      await getHotelImages(hotelId);

    return res.json({
      status: 'success',
      data: images
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 'error',
      message: 'Không thể lấy hình ảnh khách sạn'
    });
  }
};


// ========================================
// GET IMAGE BY ID
// ========================================

export const getImage = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      Number(req.params.id);

    const image =
      await getHotelImage(id);

    return res.json({
      status: 'success',
      data: image
    });

  } catch (error) {

    return res.status(404).json({
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Không tìm thấy hình ảnh'
    });
  }
};


// ========================================
// CREATE IMAGE
// ========================================

export const createImage = async (
  req: Request,
  res: Response
) => {

  try {

    const hotelId =
      Number(req.params.hotelId);

    const {
      image_url,
      is_primary
    } = req.body;

    if (!hotelId) {
      return res.status(400).json({
        status: 'error',
        message: 'hotelId không hợp lệ'
      });
    }

    if (!image_url) {
      return res.status(400).json({
        status: 'error',
        message: 'image_url không được để trống'
      });
    }

    const image =
      await createHotelImage(
        hotelId,
        image_url,
        is_primary ?? false
      );

    return res.status(201).json({
      status: 'success',
      message: 'Thêm hình ảnh thành công',
      data: image
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 'error',
      message: 'Không thể thêm hình ảnh'
    });
  }
};


// ========================================
// SET PRIMARY IMAGE
// ========================================

export const setPrimary = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      Number(req.params.id);

    const image =
      await setPrimaryImage(id);

    return res.json({
      status: 'success',
      message:
        'Đặt hình ảnh chính thành công',
      data: image
    });

  } catch (error) {

    return res.status(404).json({
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Không tìm thấy hình ảnh'
    });
  }
};


// ========================================
// DELETE IMAGE
// ========================================

export const deleteImage = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      Number(req.params.id);

    const image =
      await deleteHotelImage(id);

    return res.json({
      status: 'success',
      message:
        'Xóa hình ảnh thành công',
      data: image
    });

  } catch (error) {

    return res.status(404).json({
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Không tìm thấy hình ảnh'
    });
  }
};