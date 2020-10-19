import {
  IBudgetCashflowReport,
  IBudgetCashflowPortion,
  IBudgetDailyReport,
  ICashflowReport,
  ICashflow,
  ICashflowToExport,
  ICategory,
  IBudget,
  ICashflowExport,
} from "../interfaces";
import CashFlowModel from "./cashflow.schema.model";
import BudgetModel from "./budget.schema.model";
import CategoryModel from "./category.schema.model";
import { getCategoryById } from "./category.model";

const getCashflowById = (cashflowId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    if (!userId || !cashflowId) {
      reject({ message: `bad request`, status: 400 });
    }

    CashFlowModel.findById(cashflowId)
      .then((cashflow) => {
        if (cashflow) {
          if (cashflow.budget_id) {
            BudgetModel.findById(cashflow?.budget_id)
              .then((budget) => {
                if (budget) {
                  CategoryModel.findById(budget?.category_id)
                    .then((category) => {
                      resolve(
                        ICashflowToExport(
                          cashflow,
                          budget,
                          category?.toObject()
                        )
                      );
                    })
                    .catch((err) => {
                      throw err;
                    });
                } else {
                  resolve(ICashflowToExport(
                    cashflow,
                    undefined,
                    undefined
                  ));

                  // throw Error("not found");
                }
              })
              .catch((err) => {
                throw err;
              });
          } else {
            getCategoryById(cashflow.category_id as string, userId).then((resp => {
              resolve(ICashflowToExport(cashflow, undefined, resp as ICategory));
            })).catch((err) => {
              throw err;
            });
          }
        } else {
          throw Error("not found");
        }
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "bad request", status: 400 });
      });
  });
};

const getCashflowByBudget = (
  budgetID: string,
  userId: string,
  startDateStr: string,
  endDateStr: string
) => {
  return new Promise((resolve, reject) => {
    if (!userId || !budgetID) {
      reject({ message: `bad request`, status: 400 });
    }

    let filter = {};
    if (startDateStr && endDateStr) {
      // query by date sent
      const startDate: Date = new Date(startDateStr);
      const endDate: Date = new Date(endDateStr);

      filter = {
        user_id: userId,
        budget_id: budgetID,
        input_date: { $gte: startDate, $lte: endDate },
      };
    } else {
      filter = {
        user_id: userId,
        budget_id: budgetID,
      };
    }

    BudgetModel.findById(budgetID)
      .then((budget) => {
        if (budget) {
          let result: IBudgetCashflowReport = {
            cashflows: [],
            totalExpenses: 0,
            totalIncome: 0,
            totalBalance: 0,
            budget: budget,
          };

          CategoryModel.findById(budget.category_id)
            .then((category) => {
              CashFlowModel.find(filter)
                .sort([["created_date", 1]])
                .then((cashflows) => {
                  let flows: ICashflowExport[] = [];
                  if (cashflows) {
                    flows = cashflows.map((val) => {
                      const cashflowVal: ICashflow = val.toObject();
                      if (cashflowVal.type == "expense") {
                        result.totalExpenses =
                          result.totalExpenses + cashflowVal.amount;
                      } else {
                        result.totalIncome += cashflowVal.amount;
                      }
                      return ICashflowToExport(
                        val,
                        budget,
                        category?.toObject()
                      );
                    });
                    result.totalBalance =
                      result.totalIncome - result.totalExpenses;
                  }
                  result.cashflows = flows;
                  resolve(result);
                })
                .catch((err) => {
                  throw err;
                });
            })
            .catch((err) => {
              throw err;
            });
        } else {
          throw Error("budget not found");
        }
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "bad request", status: 500 });
      });
  });
};

const getCashflowReport = (
  userId: string,
  startDateStr: string,
  endDateStr: string,
  categories: ICategory[],
  budgets: IBudget[]
) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject({ message: `bad request`, status: 400 });
    }

    let categoryMap = new Map();
    categories.forEach((value) => {
      categoryMap.set(value._id.toString(), value);
    });

    let budgetMap = new Map();
    budgets.forEach((value) => {
      budgetMap.set(value._id.toString(), value);
    });

    let filter = {};
    if (startDateStr && endDateStr) {
      // query by date sent
      const startDate: Date = new Date(startDateStr);
      const endDate: Date = new Date(endDateStr);

      filter = {
        user_id: userId,
        input_date: { $gte: startDate, $lte: endDate },
      };
    } else {
      filter = {
        user_id: userId,
      };
    }

    let result: ICashflowReport = {
      cashflows: [],
      budgetReport: [],
      dailyReport: [],
      totalExpenses: 0,
      totalIncome: 0,
      totalBalance: 0,
    };

    CashFlowModel.find(filter)
      .sort([["created_date", 1]])
      .then((cashflows) => {
        let cashFlowExport: ICashflowExport[] = [];
        if (cashflows) {
          let reportPerBudget = new Map();
          let reportDaily = new Map();

          cashflows.forEach((val) => {
            // count total
            const cashflowVal: ICashflow = val.toObject();
            if (cashflowVal.type == "expense") {
              result.totalExpenses += Number(cashflowVal.amount);
            } else {
              result.totalIncome += Number(cashflowVal.amount);
            }

            // count per budget
            let budgetID = cashflowVal.budget_id;
            let budgetInfo = budgetMap.get(budgetID);
            if (!cashflowVal.budget_id) {
              budgetID = "uncategorized";
              budgetInfo = {
                _id: "uncategorized",
                name: "Uncategorized",
                category: {},
              };
            }

            if (reportPerBudget.get(budgetID)) {
              let report = reportPerBudget.get(budgetID);
              if (cashflowVal.type == "expense") {
                report.totalExpenses += Number(cashflowVal.amount);
              } else {
                report.totalIncome += Number(cashflowVal.amount);
              }
              reportPerBudget.set(budgetID, report);
            } else {
              const report: IBudgetCashflowPortion = {
                expensePercentage: 0,
                incomePercentage: 0,
                totalExpenses:
                  cashflowVal.type === "expense"
                    ? Number(cashflowVal.amount)
                    : 0,
                totalIncome:
                  cashflowVal.type === "income"
                    ? Number(cashflowVal.amount)
                    : 0,
                budget: budgetInfo,
              };
              reportPerBudget.set(budgetID, report);
            }

            // count daily
            const day: string = cashflowVal.input_date.toDateString();
            const parsed: Date = new Date(Date.parse(day));
            if (reportDaily.get(day)) {
              let report = reportDaily.get(day);
              if (cashflowVal.type == "expense") {
                report.totalExpenses += Number(cashflowVal.amount);
              } else {
                report.totalIncome += Number(cashflowVal.amount);
              }
              report.details.push(ICashflowToExport(
                cashflowVal,
                budgetMap.get(cashflowVal.budget_id),
                categoryMap.get(cashflowVal.category_id)
              ));
              reportDaily.set(day, report);
            } else {
              const report: IBudgetDailyReport = {
                totalExpenses:
                  cashflowVal.type === "expense"
                    ? Number(cashflowVal.amount)
                    : 0,
                totalIncome:
                  cashflowVal.type === "income"
                    ? Number(cashflowVal.amount)
                    : 0,
                totalBalance:
                  cashflowVal.type === "income"
                    ? Number(cashflowVal.amount)
                    : Number(cashflowVal.amount) * -1,
                date: parsed.toISOString(),
                details: [ICashflowToExport(
                  cashflowVal,
                  budgetMap.get(cashflowVal.budget_id),
                  categoryMap.get(cashflowVal.category_id)
                )],
              };
              reportDaily.set(day, report);
            }

            // export
            cashFlowExport.push(
              ICashflowToExport(
                cashflowVal,
                budgetMap.get(cashflowVal.budget_id),
                categoryMap.get(cashflowVal.category_id)
              )
            );
          });

          result.totalBalance = result.totalIncome - result.totalExpenses;

          let budgets: IBudgetCashflowPortion[] = [];
          reportPerBudget.forEach((value) => {
            value.expensePercentage = +(
              (value.totalExpenses / result.totalExpenses) *
              100
            ).toFixed(3);
            value.incomePercentage = +(
              (value.totalIncome / result.totalIncome) *
              100
            ).toFixed(3);
            budgets.push(value);
          });
          result.budgetReport = budgets;

          let daily: IBudgetDailyReport[] = [];
          reportDaily.forEach((value) => {
            daily.push(value);
          });
          result.dailyReport = daily;
        }
        result.cashflows = cashFlowExport;
        resolve(result);
      })
      .catch((err) => {
        throw err;
      });
  });
};

const postCashflow = (cashflow: ICashflow, userId: string) => {
  return new Promise((resolve, reject) => {
    cashflow.user_id = userId;

    //   update budget if necessary
    console.log(cashflow.budget_id);

    if (cashflow.budget_id) {
      BudgetModel.findById(cashflow.budget_id)
        .then((budget) => {
          if (budget) {
            if (cashflow.type === "expense") {
              budget.spent += Number(cashflow.amount);
              budget
                ?.save()
                .then((res) => { })
                .catch((err) => {
                  throw err;
                });
            }

            cashflow.category_id = budget.category_id;
            CashFlowModel.create(cashflow)
              .then((cashflow) => {
                resolve(cashflow);
              })
              .catch((err) => {
                throw err;
              });
          } else {
            throw Error("budget not found");
          }
        })
        .catch((err) => {
          console.log(err);
          reject({ message: "failed to add cashflow", status: 500 });
        });
    } else {
      // just insert if no budget
      CashFlowModel.create(cashflow)
        .then((cashflow) => {
          resolve(cashflow);
        })
        .catch((err) => {
          console.log(err);
          reject({ message: "failed to add cashflow", status: 500 });
        });
    }
  });
};

const updateCashflow = (
  cashflow: ICashflow,
  cashflowId: string,
  userId: string
) => {
  return new Promise((resolve, reject) => {
    CashFlowModel.find({
      user_id: userId,
      _id: cashflowId,
    })
      .then((oldCashflow) => {
        if (oldCashflow.length == 0) {
          reject({ message: "bad request", status: 400 });
          return;
        }

        //   update budget if necessary
        if (cashflow.budget_id && cashflow.budget_id !== oldCashflow[0].budget_id && oldCashflow[0].type && cashflow.amount !== null) {
          BudgetModel.findById(oldCashflow[0].budget_id)
            .then((budget) => {
              if (budget) {
                budget.spent -= Number(oldCashflow[0].amount);
                budget?.save()
                  .then((res) => {
                    BudgetModel.findById(cashflow.budget_id)
                      .then((budget) => {
                        if (budget) {
                          budget.spent += Number(cashflow.amount);
                          budget
                            ?.save()
                            .then((res) => {
                              CashFlowModel.updateOne({ _id: cashflowId }, cashflow)
                                .then((budget) => {
                                  resolve(budget);
                                })
                                .catch((err) => {
                                  throw err;
                                });
                            })
                            .catch((err) => {
                              throw err;
                            });
                        }
                      })
                      .catch((err) => {
                        throw err;
                      });
                  })
                  .catch((err) => {
                    throw err;
                  });
              }
            })
            .catch((err) => {
              throw err;
            });
        }
        else if (
          oldCashflow[0].budget_id &&
          oldCashflow[0].type === "expense" &&
          cashflow.amount != null
        ) {

          BudgetModel.findById(oldCashflow[0].budget_id)
            .then((budget) => {
              if (budget) {
                budget.spent -= oldCashflow[0].amount;
                budget.spent += Number(cashflow.amount);
                budget
                  ?.save()
                  .then((res) => {
                    CashFlowModel.updateOne({ _id: cashflowId }, cashflow)
                      .then((budget) => {
                        resolve(budget);
                      })
                      .catch((err) => {
                        throw err;
                      });
                  })
                  .catch((err) => {
                    throw err;
                  });
              }
            })
            .catch((err) => {
              throw err;
            });
        } else {
          // if not updating budget, just update cashflow content
          CashFlowModel.updateOne({ _id: cashflowId }, cashflow)
            .then((budget) => {
              resolve(budget);
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "failed to update cashflow", status: 500 });
      });
  });
};

const deleteCashflow = (cashflowId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    CashFlowModel.find({ user_id: userId, _id: cashflowId })
      .then((cashflow) => {
        if (cashflow.length == 0) {
          throw Error("not found");
        }

        //   update budget if necessary
        if (cashflow[0].budget_id && cashflow[0].type === "expense") {
          BudgetModel.findById(cashflow[0].budget_id)
            .then((budget) => {
              if (budget) {
                budget.spent -= cashflow[0].amount;
                budget
                  ?.save()
                  .then((res) => {
                    CashFlowModel.deleteOne({ _id: cashflowId })
                      .then((cashflow) => {
                        resolve(cashflow);
                      })
                      .catch((err) => {
                        throw err;
                      });
                  })
                  .catch((err) => {
                    throw err;
                  });
              }
            })
            .catch((err) => {
              throw err;
            });
        } else {
          CashFlowModel.deleteOne({ _id: cashflowId })
            .then((cashflow) => {
              resolve(cashflow);
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "failed to delete budget", status: 500 });
      });
  });
};

export default {
  getCashflowById,
  getCashflowByBudget,
  getCashflowReport,
  postCashflow,
  updateCashflow,
  deleteCashflow,
};
