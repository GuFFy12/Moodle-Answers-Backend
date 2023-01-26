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
			default: { appenders: ['out'], level: 'all' },
			Server: { appenders: ['out'], level: 'all' },
			App: { appenders: ['out'], level: 'all' },
			Http: { appenders: ['out'], level: 'all' },
			ServerRouter: { appenders: ['out'], level: 'all' },
			PlayerRouter: { appenders: ['out'], level: 'all' },
			ServerControllers: { appenders: ['out'], level: 'all' },
			PlayersControllers: { appenders: ['out'], level: 'all' },
		},
		pm2: true,
	});
};
