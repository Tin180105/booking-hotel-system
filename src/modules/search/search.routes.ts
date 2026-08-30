import { Router } from 'express'

import {
  SearchController
} from './search.controller'

const router = Router()

router.get(
  '/hotels',
  SearchController.searchHotels
)

export default router