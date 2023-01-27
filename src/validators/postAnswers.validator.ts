import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export default [
	body('cmId', 'CM ID is required').exists().toInt().isInt({ min: 1 }),
	body('percent', 'Percent is required').optional().isNumeric().isInt({ min: 0, max: 100 }),
	body('answers', 'Answers is required').exists().isObject(),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];
