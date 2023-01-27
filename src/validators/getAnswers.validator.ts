import { NextFunction, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

export default [
	query('cmId', 'CM ID is required').exists().toInt().isInt({ min: 1 }),
	query('questionId', 'Question ID is required')
		.exists()
		.matches(/q\d+:\d+/),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];
