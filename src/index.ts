import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import router from './routes/router.js';

const app = express();
app.use(bodyParser.json());

app.use(router);

app.listen('8080', () => {
	console.log('listening on http://localhost:8080');
});
