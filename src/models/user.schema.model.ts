import { Schema, Document } from "mongoose";
import { hashPassword } from "../helpers/helper";
import { IUser } from "../interfaces";
import dbConnection from "../db";

export interface IUserSchema extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "updated_date",
    },
  }
);

UserSchema.pre("validate", function (next) {
  let { password }: IUser = this.toObject();
  this.set("password", hashPassword(password as string));
  next();
});

const UserModel = dbConnection.model<IUserSchema>("User", UserSchema);

export default UserModel;
