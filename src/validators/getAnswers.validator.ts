import { NextFunction, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

export default [
	query('cmId', 'CM ID is required').exists().toInt().isInt({ min: 1 }),
	query('question', 'Question is required').exists().isString(),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];
