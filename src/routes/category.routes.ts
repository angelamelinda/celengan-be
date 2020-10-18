import { Router } from "express";
import { authenticate } from "../helpers/middleware";

import category from "../models/category.model";

const router = Router();

// create new
router.post("/", authenticate, async (req: any, res: any) => {
    const { user, body } = req;

    await category
        .postCategory(body, user._id)
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

// get by user id
router.get("/", authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await category
        .getCategoryByUserId(user._id)
        .then((category) => {
            res.json({ data: category });
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
router.get("/:id", authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await category
        .getCategoryById(id, user._id)
        .then((category) => {
            res.json({ data: category });
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

    await category
        .updateCategory(body, id, user._id)
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

// delete
router.delete("/:id", authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await category
        .deleteCategory(id, user._id)
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

module.exports = router;
