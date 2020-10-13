import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./src/routes/index.routes'));
// First route
app.get('/', (req, res) => {
    res.json({ message: 'Hello world' })
})

// Starting server
app.listen('1337')