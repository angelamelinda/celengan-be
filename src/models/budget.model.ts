import { IBudget, ICategory, IBudgetToExport } from "../interfaces";
import BudgetModel from "./budget.schema.model";
import CategoryModel from "./category.schema.model";

const getBudgetsByDate = (
  startDateStr: string,
  endDateStr: string,
  userId: string,
  categories: ICategory[]
) => {
  return new Promise((resolve, reject) => {
    let categoryMap = new Map();
    categories.forEach((value) => {
      categoryMap.set(value._id.toString(), value);
    });

    let filter = {};
    if (startDateStr && endDateStr) {
      // query by date sent
      const startDate: Date = new Date(startDateStr);
      const endDate: Date = new Date(endDateStr);
      console.log('START DATE', startDate, 'END DATE', endDate)
      filter = {
        user_id: userId,
        $and: [
          { start_date: { $gte: startDate } },
          { end_date: { $lte: endDate } },
        ],
      };
    } else {
      filter = {
        user_id: userId,
      };
    }

    BudgetModel.find(filter)
      .then((budgetList) => {
        resolve(
          budgetList.map((budgetItem) => {
            return IBudgetToExport(
              budgetItem,
              categoryMap.get(budgetItem.category_id)
            );
          })
        );
      })
      .catch((err) => {
        reject({
          message: "failed to get user budget",
          status: 500,
        });
      });
  });
};

const getBudgetById = (budgetId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    if (!userId || !budgetId) {
      reject({ message: `bad request`, status: 400 });
    }

    BudgetModel.findById(budgetId)
      .then((budgets) => {
        if (budgets) {
          CategoryModel.findById(budgets.category_id)
            .then((category) => {
              resolve(IBudgetToExport(budgets, category?.toObject()));
            })
            .catch((err) => {
              throw err;
            });
        } else {
          reject({ message: "bad request", status: 400 });
        }
      })
      .catch((err) => {
        reject({ message: "bad request", status: 400 });
      });
  });
};

const postBudget = (budget: IBudget, userId: string) => {
  return new Promise((resolve, reject) => {
    if (budget.category_id) {
      CategoryModel.findById(budget.category_id)
        .then((category) => {
          if (!category) {
            reject({ message: "invalid category", status: 400 });
            return;
          }

          budget.user_id = userId;
          budget.spent = 0;
          BudgetModel.create(budget)
            .then((budget) => {
              resolve(budget);
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          console.log(err);
          reject({ message: "failed to add budget", status: 500 });
        });
    }
  });
};

const updateBudget = (budget: IBudget, budgetId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    BudgetModel.find({
      user_id: userId,
      _id: budgetId,
    })
      .then((res) => {
        if (res.length == 0) {
          reject({ message: "bad request", status: 400 });
          return;
        }

        BudgetModel.updateOne({ _id: budgetId }, budget)
          .then((budget) => {
            resolve(budget);
          })
          .catch((err) => {
            console.log(err);
            reject({ message: "failed to update budget", status: 500 });
          });
      })
      .catch((err) => {
        reject({ message: "bad request", status: 400 });
      });
  });
};

const deleteBudget = (budgetId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    BudgetModel.find({ user_id: userId, _id: budgetId })
      .then((res) => {
        BudgetModel.deleteOne({ _id: budgetId })
          .then((budget) => {
            resolve(budget);
          })
          .catch((err) => {
            reject({ message: "failed to delete budget", status: 500 });
          });
      })
      .catch((err) => {
        reject({ message: "bad request", status: 400 });
      });
  });
};

export default {
  getBudgetById,
  getBudgetsByDate,
  postBudget,
  updateBudget,
  deleteBudget,
};
