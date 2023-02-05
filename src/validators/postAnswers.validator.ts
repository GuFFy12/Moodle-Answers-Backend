import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export default [
	body('cmId', 'CM ID is required').exists().toInt().isInt({ min: 1 }),
	body('percent', 'Percent is required').optional().toInt().isInt({ min: 0, max: 100 }),
	body('questionsData', 'Questions Data is required').exists().isArray(),

	body('questionsData.*.question', 'Question is required').exists().isString(),

	body('questionsData.*.answersOptions', 'Answers Options is required').optional().isArray(),
	body('questionsData.*.answersOptions.*', 'Answers Options must be an array of strings').isString(),

	body('questionsData.*.answers', 'Answers is required').exists().isArray(),
	body('questionsData.*.answers.*', 'Answers must be an array of strings').isString(),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];
