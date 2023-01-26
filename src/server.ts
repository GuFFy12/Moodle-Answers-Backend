import dotenv from 'dotenv';
import log4js, { Logger } from 'log4js';
import mongoose from 'mongoose';

import App from './app.js';
import SettingsSchema from './models/settings.model.js';
import { ISettingsSchema } from './types/models.types.js';
import ApiRequestLimiterUtil from './util/apiRequestLimiter.util.js';
import loggerUtil from './util/logger.util.js';

class Server {
	private readonly logger: Logger;

	private readonly MONGO_URI: string;

	public constructor() {
		this.logger = log4js.getLogger(this.constructor.name);

		dotenv.config();
		this.MONGO_URI = process.env.MONGO_URI;

		void this.initDB().then((settings) => this.init(settings));
	}

	private readonly initDB = async () => {
		mongoose.connect(this.MONGO_URI, (error) => {
			if (!error) this.logger.error(error);
		});

		return (await SettingsSchema.find().lean())[0];
	};

	private readonly init = (settings: ISettingsSchema) => {
		loggerUtil(settings.maxLogSize, settings.maxLogBackups);

		this.logger.info('Init app...');

		const apiRequestLimiterUtil = new ApiRequestLimiterUtil(settings.windowMs, settings.max);
		new App(settings.port, apiRequestLimiterUtil).init();
	};
}

new Server();
