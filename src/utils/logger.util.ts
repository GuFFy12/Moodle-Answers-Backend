import log4js from 'log4js';

export default (maxLogSize: number, maxLogBackups: number) => {
	log4js.configure({
		appenders: {
			out: { type: 'stdout' },
			log: {
				type: 'file',
				filename: './logs/app.log',
				maxLogSize: maxLogSize,
				backups: maxLogBackups,
				compress: true,
				layout: {
					type: 'pattern',
					pattern: '%d %p %c %m',
				},
			},
		},
		categories: {
			default: { appenders: ['out', 'log'], level: 'all' },
			Server: { appenders: ['out', 'log'], level: 'all' },
			App: { appenders: ['out', 'log'], level: 'all' },
			Http: { appenders: ['out', 'log'], level: 'all' },
			AnswersRoutes: { appenders: ['out', 'log'], level: 'all' },
			AnswersControllers: { appenders: ['out', 'log'], level: 'all' },
		},
		pm2: true,
	});
};
