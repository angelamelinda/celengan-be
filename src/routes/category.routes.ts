import { Router } from 'express';
import { authenticate } from '../helpers/middleware';
import category from '../models/category.model';

const router = Router();

router.get('/expense', authenticate, async (req: any, res: any) => {
    const { user } = req;

    await category.getCategories(user.id, 'expense').then((category) => {
        res.json({ data: category })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.get('/income', authenticate, async (req: any, res: any) => {
    const { user } = req;

    await category.getCategories(user.id, 'income').then((category) => {
        res.json({ data: category })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.post('/expense', authenticate, async (req: any, res: any) => {
    const { user, body } = req;
    const { name } = body;

    await category.postCategory(name, user.id, 'expense').then(() => {
        res.status(200).json({ message: 'success' })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.post('/income', authenticate, async (req: any, res: any) => {
    const { user, body } = req;
    const { name } = body;

    await category.postCategory(name, user.id, 'income').then(() => {
        res.status(200).json({ message: 'success' })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.get('/expense/:id', authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await category.getCategory(id, user.id, 'expense').then((category) => {
        res.json({ data: category })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.get('/income/:id', authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await category.getCategory(id, user.id, 'income').then((category) => {
        res.json({ data: category })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

module.exports = router;