import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	const ip =
		<string>req.headers['cf-connecting-ip'] ||
		<string>req.headers['x-forwarded-for'] ||
		<string>req.socket.remoteAddress;

	if (
		ip === '127.0.0.1' ||
		ip === '::ffff:127.0.0.1' ||
		ip === '::1' ||
		req.get('host')?.indexOf('localhost') !== -1
	) {
		req.clientIp = 'localhost';
	} else {
		req.clientIp = ip;
	}

	next();
};
