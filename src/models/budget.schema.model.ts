import { Schema, Document } from "mongoose";
import { IBudget, IDefaultResponse } from "../interfaces";
import dbConnection from "../db";

export interface IBudgetSchema extends IBudget, Document { }

const BudgetSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    user_id: { type: String, required: true },
    category_id: { type: String, required: true },
    amount: { type: Number, required: true },
    spent: { type: Number, required: true },
    start_date: { type: Date },
    end_date: { type: Date },
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "updated_date",
    },
  }
);

const BudgetModel = dbConnection.model<IBudgetSchema>("Budget", BudgetSchema);

export default BudgetModel;
