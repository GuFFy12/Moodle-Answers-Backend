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
				if (req.clientIp === 'localhost') {
					return 0;
				} else {
					return this.max;
				}
			},
			handler: (request, response) => {
				return response
					.status(429)
					.setHeader('content-type', 'application/json')
					.send(
						JSON.stringify({
							message: 'Too many requests, please try again later',
							code: 429,
						})
					);
			},
			keyGenerator: (req) => {
				return req.clientIp;
			},
			standardHeaders: true,
		});
	};
}
