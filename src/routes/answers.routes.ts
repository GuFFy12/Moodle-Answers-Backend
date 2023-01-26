import { Router } from 'express';
import log4js, { Logger } from 'log4js';

import AnswersControllers from '../controllers/answers.controllers.js';
import getAnswersValidator from '../validators/getAnswers.validator.js';
import postAnswersValidator from '../validators/postAnswers.validator.js';

export default class AnswersRoutes {
	public readonly answersControllers: AnswersControllers;
	private readonly logger: Logger;

	public constructor() {
		this.logger = log4js.getLogger(this.constructor.name);

		this.answersControllers = new AnswersControllers();
	}

	public init = () => {
		this.logger.info('Init answers router...');

		const router: Router = Router();

		router.post('/postAnswers', postAnswersValidator, this.answersControllers.postAnswers);
		router.get('/getAnswers', getAnswersValidator, this.answersControllers.getAnswers);

		return router;
	};
}
