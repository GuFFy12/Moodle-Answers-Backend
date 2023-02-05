import log4js from 'log4js';

export default () => {
	log4js.configure({
		appenders: {
			out: { type: 'stdout' },
		},
		categories: {
			default: { appenders: ['out'], level: 'all' },
			Server: { appenders: ['out'], level: 'all' },
			App: { appenders: ['out'], level: 'all' },
			Http: { appenders: ['out'], level: 'all' },
			AnswersRoutes: { appenders: ['out'], level: 'all' },
			AnswersControllers: { appenders: ['out'], level: 'all' },
		},
		pm2: true,
	});
};
