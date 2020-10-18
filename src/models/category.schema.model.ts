import { Schema, Document } from "mongoose";
import { ICategory } from "../interfaces";
import dbConnection from "../db";

export interface ICategorySchema extends ICategory, Document { }

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    user_id: { type: String, required: true },
    icon: { type: String, required: false },
    type: { type: String, enum: ["expense", "income"], required: true },
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "updated_date",
    },
  }
);

const CategoryModel = dbConnection.model<ICategorySchema>(
  "Category",
  CategorySchema
);

export default CategoryModel;
