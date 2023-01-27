import { Request, Response } from 'express';
import log4js, { Logger } from 'log4js';

import AnswerModel from '../models/answer.model.js';
import QuestionModel from '../models/question.model.js';
import UserModel from '../models/user.model.js';
import { IGetAnswersBody, IPostAnswerBody } from '../types/controllers.types.js';

export default class AnswersControllers {
	private readonly logger: Logger;

	public constructor() {
		this.logger = log4js.getLogger(this.constructor.name);
	}

	public readonly getAnswers = (req: Request, res: Response) => {
		void (async () => {
			this.logger.info('getAnswers called');

			const { cmId, questionId } = req.query as unknown as IGetAnswersBody;

			const question = await QuestionModel.findOneAndUpdate(
				{ cmId, questionId },
				{},
				{ upsert: true, new: true }
			);

			return res.status(200).json(
				await AnswerModel.aggregate([
					{
						$match: {
							question: question._id,
						},
					},
					{
						$group: {
							_id: '$answer',
							percent: { $avg: '$percent' },
							count: { $sum: 1 },
							updatedAt: { $max: '$createdAt' },
						},
					},
					{
						$sort: { count: -1, percent: -1 },
					},
					{
						$limit: 3,
					},
				])
			);
		})();
	};

	public readonly postAnswers = (req: Request, res: Response) => {
		void (async () => {
			this.logger.info('postAnswers called');

			const { cmId, percent, answers } = req.body as IPostAnswerBody;

			const answersGrouped = this.groupByQuestion(answers);
			if (!answersGrouped || Object.keys(answersGrouped).length === 0)
				return res.status(400).json({ message: 'No answers provided' });

			const user = await UserModel.findOneAndUpdate({ ip: req.clientIp }, {}, { upsert: true, new: true });

			for (const questionId of Object.keys(answersGrouped)) {
				const question = await QuestionModel.findOneAndUpdate(
					{ cmId, questionId },
					{},
					{ upsert: true, new: true }
				);

				await AnswerModel.create({
					user: user._id,
					question: question._id,
					percent,
					answer: answersGrouped[questionId],
				});
			}

			return res.status(200).json({ message: 'Answers saved' });
		})();
	};

	private readonly groupByQuestion = (answers: Record<string, string>) => {
		return Object.keys(answers).reduce((result: Record<string, Record<string, string>> = {}, question) => {
			if (!/q\d+:\d+_\w+/.test(question)) return;

			const questionId = question.split('_')[0];

			if (!result[questionId]) {
				result[questionId] = {};
			}

			result[questionId][question] = answers[question];

			return result;
		}, {});
	};
}
