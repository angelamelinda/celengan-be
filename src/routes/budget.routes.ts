import { Router } from 'express';
import { authenticate } from '../helpers/middleware';
import budget from '../models/budget.model';

const router = Router();

router.get('/:id', authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await budget.getBudgetById(id, user.id).then((budget) => {
        res.json({ data: budget })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.get('/', authenticate, async (req: any, res: any) => {
    const { user, query } = req;
    const { start_date, end_date } = query;

    await budget.getBudgetsByDate(start_date, end_date, user.id).then((budget) => {
        res.json({ data: budget })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.delete('/:id', authenticate, async (req: any, res: any) => {
    const { user, params } = req;
    const { id } = params;

    await budget.deleteBudget(id, user.id).then(() => {
        res.json({ message: 'success' })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})

router.put('/:id', authenticate, async (req: any, res: any) => {
    const { user, params, body } = req;
    const { id } = params;

    await budget.updateBudget(body, id, user.id).then(() => {
        res.json({ message: 'success' })
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})


router.post('/', authenticate, async (req: any, res: any) => {
    const { user, body } = req;
    console.log('body', body)
    await budget.postBudget(body, user.id).then(() => {
        res.json({ message: 'success' })
    }).catch((err) => {
        const { status, message } = err;
        console.log('error', err)
        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})


module.exports = router;