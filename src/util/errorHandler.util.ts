import { NextFunction, Request, Response } from 'express';
import log4js from 'log4js';

import { IHttpException } from '../types/app.types.js';

const logger = log4js.getLogger('Http');

export default (err: IHttpException, req: Request, res: Response, next: NextFunction) => {
	if (!err.status) {
		logger.error(err);
		err.status = 500;
		err.message = 'Something went wrong on server';
	}
	res.status(err.status).send({ message: err.message, code: err.status });

	next();
};
