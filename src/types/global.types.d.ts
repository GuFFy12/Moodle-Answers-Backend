declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly MONGO_URI: string;
		}
	}
}

declare global {
	namespace Express {
		interface Request {
			clientIp: string;
		}
	}
}

export {};
