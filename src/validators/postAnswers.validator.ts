import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

export default [
	check('cmId', 'CM ID is required').exists().toInt().isInt({ min: 1 }),
	check('percent', 'Percent is required').optional().isNumeric().isInt({ min: 0, max: 100 }),
	check('answers', 'Answers is required').exists().isObject(),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];
