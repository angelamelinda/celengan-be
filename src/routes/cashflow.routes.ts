import { Router } from "express";
import { ICategory, IBudget } from "../interfaces";
import { authenticate } from "../helpers/middleware";
import cashflow from "../models/cashflow.model";
import category from "../models/category.model";
import budget from "../models/budget.model";

const router = Router();

// get report for homepage
router.get("/report", authenticate, async (req: any, res: any) => {
    const { user, query } = req;
    const { start_date, end_date } = query;
    await category
        .getCategoryByUserId(user._id)
        .then((categories) => {
            let converted: any = categories as {
                expense: ICategory[];
                income: ICategory[];
            };
            const categoryArray = [...converted.expense, ...converted.income];

            budget
                .getBudgetsByDate(start_date, end_date, user._id, categoryArray)
                .then((budgets) => {
                    cashflow
                        .getCashflowReport(
                            user._id,
                            start_date,
                            end_date,
                            categoryArray,
                            budgets as IBudget[]
                        )
                        .then((cashflow) => {
                            res.json({ data: cashflow });
                        })
                        .catch((err) => { });
                });
        })

        .catch((err) => {
            const { status, message } = err;

            if (status && message) {
                res.status(status).json({ message });
            } else {
                res.status(500).json({ message: "Sorry something went wrong!" });
            }
        });
});

// get by id
router.get("/detail/:id", authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await cashflow
        .getCashflowById(id, user._id)
        .then((cashflow) => {
            res.json({ data: cashflow });
        })
        .catch((err) => {
            const { status, message } = err;

            if (status && message) {
                res.status(status).json({ message });
            } else {
                res.status(500).json({ message: "Sorry something went wrong!" });
            }
        });
});

//

// get by id
router.get("/by_budget/:budgetid", authenticate, async (req: any, res: any) => {
    const { user, params, body } = req;
    const { budgetid } = params;
    const { start_date, end_date } = body;

    await cashflow
        .getCashflowByBudget(budgetid, user._id, start_date, end_date)
        .then((cashflow) => {
            res.json({ data: cashflow });
        })
        .catch((err) => {
            const { status, message } = err;

            if (status && message) {
                res.status(status).json({ message });
            } else {
                res.status(500).json({ message: "Sorry something went wrong!" });
            }
        });
});

// delete
router.delete("/:id", authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await cashflow
        .deleteCashflow(id, user._id)
        .then(() => {
            res.json({ message: "success" });
        })
        .catch((err) => {
            const { status, message } = err;

            if (status && message) {
                res.status(status).json({ message });
            } else {
                res.status(500).json({ message: "Sorry something went wrong!" });
            }
        });
});

// update
router.put("/:id", authenticate, async (req: any, res: any) => {
    const { user, params, body } = req;
    const { id } = params;

    await cashflow
        .updateCashflow(body, id, user._id)
        .then(() => {
            res.json({ message: "success" });
        })
        .catch((err) => {
            const { status, message } = err;

            if (status && message) {
                res.status(status).json({ message });
            } else {
                res.status(500).json({ message: "Sorry something went wrong!" });
            }
        });
});

// post new
router.post("/", authenticate, async (req: any, res: any) => {
    const { user, body } = req;

    await cashflow
        .postCashflow(body, user._id)
        .then((cashflow) => {
            res.json({ message: "success", data: cashflow });
        })
        .catch((err) => {
            const { status, message } = err;
            console.log("error", err);
            if (status && message) {
                res.status(status).json({ message });
            } else {
                res.status(500).json({ message: "Sorry something went wrong!" });
            }
        });
});

module.exports = router;
