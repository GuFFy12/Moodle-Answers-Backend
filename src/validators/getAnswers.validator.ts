import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export default [
	body('cmId', 'CM ID is required').exists().toInt().isInt({ min: 1 }),
	body('question', 'Question is required').exists().isString(),

	body('answersOptions', 'Answers Options is required').optional().isArray(),
	body('answersOptions.*', 'Answers Options must be an array of strings').isString(),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];
