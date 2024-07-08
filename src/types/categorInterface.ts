import mongoose from "mongoose"

export interface CategoryInterface {
    _id: mongoose.Types.ObjectId
    name: string
    isListed: boolean
  }