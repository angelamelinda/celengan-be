import { Router } from 'express';
import user from '../models/user.model';

const router = Router();

router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;

    await user.getUser(id).then((data) => {
        res.json(data)
    }).catch((err) => {
        const { status, message } = err;

        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
})


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    await user.register(username, email, password).then(() => {
        res.status(200).json({ message: 'success' })
    }).catch((err) => {
        const { status, message } = err;
        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    await user.login(email, password).then((data) => {
        res.status(200).json({ data })
    }).catch((err) => {
        const { status, message, } = err;
        if (status && message) {
            res.status(status).json({ message })
        } else {
            res.status(500).json({ message: 'Sorry something went wrong!' })
        }
    })
});

module.exports = router;