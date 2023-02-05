import { Router } from 'express';
import log4js, { Logger } from 'log4js';

import AnswersController from '../controllers/answers.controller.js';
import getAnswersValidator from '../validators/getAnswers.validator.js';
import postAnswersValidator from '../validators/postAnswers.validator.js';

export default class AnswersRoutes {
	private readonly logger: Logger;

	public readonly answersController: AnswersController;

	public constructor() {
		this.logger = log4js.getLogger(this.constructor.name);

		this.answersController = new AnswersController();
	}

	public init = () => {
		this.logger.info('Init answers router...');

		const router: Router = Router();

		router.post('/postQuizData', postAnswersValidator, this.answersController.postAnswers);
		router.post('/getAnswerData', getAnswersValidator, this.answersController.getAnswers);

		return router;
	};
}
