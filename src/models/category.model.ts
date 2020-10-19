import { ICategory } from "../interfaces";
import CategoryModel from "./category.schema.model";

export const getCategoryById = (cashflowId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    if (!userId || !cashflowId) {
      reject({ message: `bad request`, status: 400 });
    }

    CategoryModel.findById(cashflowId)
      .then((category) => {
        if (category) {
          resolve(category);
        } else {
          resolve({
            expense: [],
            income: [],
          })
        }
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "bad request", status: 400 });
      });
  });
};

const getCategoryByUserId = (userId: string) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject({ message: `bad request`, status: 400 });
    }

    CategoryModel.find({
      user_id: userId,
    })
      .then((category) => {
        if (category.length > 0) {
          let expenses: ICategory[] = [];
          let incomes: ICategory[] = [];
          category.forEach((element) => {
            let object = element.toObject();
            if (object.type == "expense") {
              expenses.push(element);
            } else {
              incomes.push(element);
            }
          });
          resolve({
            expense: expenses,
            income: incomes,
          });
        } else {
          resolve({
            expense: [],
            income: [],
          });
        }
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "bad request", status: 400 });
      });
  });
};

const postCategory = (Category: ICategory, userId: string) => {
  return new Promise((resolve, reject) => {
    Category.user_id = userId;
    CategoryModel.create(Category)
      .then((Category) => {
        resolve(Category);
      })
      .catch((err) => {
        console.log(err);
        reject({
          message: "failed to add Category",
          status: 500,
        });
      });
  });
};

const updateCategory = (
  Category: ICategory,
  categoryId: string,
  userId: string
) => {
  return new Promise((resolve, reject) => {
    CategoryModel.find({
      user_id: userId,
      _id: categoryId,
    })
      .then((res) => {
        if (res.length == 0) {
          reject({
            message: "bad request",
            status: 400,
          });
          return;
        }

        CategoryModel.updateOne({ _id: categoryId }, Category)
          .then((Category) => {
            resolve(Category);
          })
          .catch((err) => {
            console.log(err);
            reject({
              message: "failed to update Category",
              status: 500,
            });
          });
      })
      .catch((err) => {
        reject({
          message: "bad request",
          status: 400,
        });
      });
  });
};

const deleteCategory = (categoryId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    CategoryModel.find({
      user_id: userId,
      _id: categoryId,
    })
      .then((res) => {
        CategoryModel.deleteOne({ _id: categoryId })
          .then((Category) => {
            resolve(Category);
          })
          .catch((err) => {
            reject({
              message: "failed to delete Category",
              status: 500,
            });
          });
      })
      .catch((err) => {
        reject({
          message: "bad request",
          status: 400,
        });
      });
  });
};

export default {
  getCategoryById,
  getCategoryByUserId,
  postCategory,
  updateCategory,
  deleteCategory,
};
