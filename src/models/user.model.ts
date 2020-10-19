import { hashPassword, getToken } from "../helpers/helper";
import { IUser, IUserJWT } from "../interfaces";
import UserModel from "./user.schema.model";
import { Document } from "mongoose";

const getUser = (id: string) => {
  return new Promise((resolve, reject) => {
    UserModel.findById(id, function (err: Error, user: Document) {
      // if (err) return handleError(err);
      if (err || user == null) {
        reject({ message: "user not found", status: 404 });
        return;
      }

      const userObj = user.toObject();
      resolve({ username: userObj.username, email: userObj.email });
    });
  });
};

const login = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    password = hashPassword(password);
    UserModel.find({ email: email, password: password })
      .maxTimeMS(3000)
      .then((result) => {
        if (result.length === 0) {
          throw Error("invalid user");
        }
        const user: IUser = result[0];
        const userJWT: IUserJWT = {
          _id: user._id,
          email: user.email,
          username: user.username,
        };
        const token = getToken(userJWT);
        resolve({ token, user: userJWT });
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "invalid email or password", status: 400 });
      });
  });
};

const register = (username: string, email: string, password: string) => {
  return new Promise((resolve, reject) => {
    if (!(username && email && password)) {
      reject({
        message: "username or email or password is not complete",
        status: 400,
      });
    }

    UserModel.find({ $or: [{ email: email }, { username: username }] })
      .then((results) => {
        if (results.length > 0) {
          reject({
            message: "username or email already registered",
            status: 400,
          });
          return;
        }

        const userData: any[] = [
          {
            username: username,
            email: email,
            password: password,
          },
        ];

        UserModel.create(userData)
          .then((user) => {
            resolve();
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        reject({
          message: "failed to register",
          status: 400,
        });
      });

  });
};

export default {
  getUser,
  login,
  register,
};
