import { Schema, Document } from "mongoose";
import { ICashflow } from "../interfaces";
import dbConnection from "../db";

export interface ICashflowSchema extends ICashflow, Document { }

const CashflowSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    budget_id: { type: String, required: false },
    category_id: { type: String, required: false },
    notes: { type: String, required: false },
    type: { type: String, enum: ["expense", "income"], required: true },
    input_date: { type: Date, required: true },
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "updated_date",
    },
  }
);

const CashflowModel = dbConnection.model<ICashflowSchema>(
  "Cashflow",
  CashflowSchema
);

export default CashflowModel;
