import { Router } from 'express';
import { parseGamePreferences } from '../middlewares/game_preferences_parser.js';

const router = Router();

router.post('/start', parseGamePreferences, (req, res) => {
	console.log(req.body.game);
	res.json({
		status: 200,
		message: req.body.game
	});
});

export default router;
