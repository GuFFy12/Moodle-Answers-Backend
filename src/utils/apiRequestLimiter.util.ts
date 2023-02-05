import rateLimit from 'express-rate-limit';

export default class ApiRequestLimiterUtil {
	public readonly windowMs: number;
	public readonly max: number;

	public constructor(windowMs: number, max: number) {
		this.windowMs = windowMs;
		this.max = max;
	}

	public readonly init = () => {
		return rateLimit({
			windowMs: this.windowMs,
			max: (req) => {
				if (req.clientIp === 'localhost' || req.method === 'GET') return 0;
				if (req.url.endsWith('/getAnswerData')) return 0;

				return this.max;
			},
			handler: (request, response) => {
				return response.status(429).json({
					message: 'Too many requests, please try again later',
					code: 429,
				});
			},
			keyGenerator: (req) => {
				return req.clientIp;
			},
			standardHeaders: true,
		});
	};
}
