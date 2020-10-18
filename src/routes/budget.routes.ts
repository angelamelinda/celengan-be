import { Router } from "express";
import { authenticate } from "../helpers/middleware";
import budget from "../models/budget.model";
import category from "../models/category.model";
import { ICategory } from "../interfaces";

const router = Router();

// get by id
router.get("/:id", authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await budget
        .getBudgetById(id, user._id)
        .then((budget) => {
            res.json({ data: budget });
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

// get range
router.get("/", authenticate, async (req: any, res: any) => {
    const { user, query } = req;
    const { start_date, end_date } = query;
    await category
        .getCategoryByUserId(user._id)
        .then((categories) => {
            let converted: any = categories as {
                expense: ICategory[];
                income: ICategory[];
            };

            budget
                .getBudgetsByDate(start_date, end_date, user._id, [
                    ...converted.expense,
                    ...converted.income,
                ])
                .then((budget) => {
                    res.json({ data: budget });
                })
                .catch((err) => {
                    throw err;
                });
        })
        .catch((err) => {
            const { status, message } = err;
            console.log(err);

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

    await budget
        .deleteBudget(id, user._id)
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

    await budget
        .updateBudget(body, id, user._id)
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

// Add new
router.post("/", authenticate, async (req: any, res: any) => {
    const { user, body } = req;

    await budget
        .postBudget(body, user._id)
        .then((budget) => {
            res.json({ message: "success", data: budget });
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
