import cors from 'cors';
import express from 'express';
import * as core from 'express-serve-static-core';
import helmet from 'helmet';
import log4js, { Logger } from 'log4js';

import AnswersRoutes from './routes/answers.routes.js';
import ApiRequestLimiterUtil from './util/apiRequestLimiter.util.js';
import errorHandler from './util/errorHandler.util.js';
import ipParser from './util/ipParser.util.js';

export default class App {
	private readonly logger: Logger;

	private readonly port: number;

	private readonly app: core.Express;
	private readonly apiRequestLimiterUtil: ApiRequestLimiterUtil;
	private readonly answersRoutes: AnswersRoutes;

	public constructor(port: number, apiRequestLimiterUtil: ApiRequestLimiterUtil) {
		this.logger = log4js.getLogger(this.constructor.name);

		this.app = express();

		this.port = port;
		this.apiRequestLimiterUtil = apiRequestLimiterUtil;

		this.answersRoutes = new AnswersRoutes();
	}

	public readonly init = () => {
		void this.modulesInit();
		this.app.listen(this.port, () => this.logger.info(`Server running on http://localhost:${this.port}`));
	};

	private readonly modulesInit = () => {
		this.logger.info('Init app modules...');

		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(ipParser);
		this.app.use(express.json());
		this.app.use(this.apiRequestLimiterUtil.init());
		this.app.use(log4js.connectLogger(log4js.getLogger('Http'), { level: 'auto' }));

		this.app.use('/', this.answersRoutes.init()); //TODO: replace to /api/v1, now create it in nginx config

		this.app.use(errorHandler);
	};
}
