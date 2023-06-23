import { Body, Controller, Get, HttpCode, Ip, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AppService } from './app.service';
import { GetAnswersDataDto } from './dto/getAnswersData.dto';
import { PostQuizDataDto } from './dto/postQuizData.dto';

@Controller()
export class AppController {
	constructor(private readonly answersService: AppService) {}

	@Get('getAnswerData')
	@HttpCode(200)
	async getAnswersData(@Query() getAnswersDataDto: GetAnswersDataDto) {
		return this.answersService.getAnswersGroupedByQuestion(
			{
				question_answerOptions_md5: getAnswersDataDto.question_answerOptions_md5,
			},
			getAnswersDataDto.skip,
			getAnswersDataDto.take,
		);
	}

	@Post('postQuizData')
	@Throttle(3, 60)
	async postQuizData(@Body() postQuizDataDto: PostQuizDataDto, @Ip() ip: string) {
		const user = await this.answersService.upsertUser({ id: postQuizDataDto.userId, lastIp: ip });

		const course = await this.answersService.upsertCourse({
			id: postQuizDataDto.paths.course.id,
			name: postQuizDataDto.paths.course.name,
		});
		const section = await this.answersService.upsertSection({
			courseId: course.id,
			sectionId: postQuizDataDto.paths.section.id,
			name: postQuizDataDto.paths.section.name,
		});
		const module = await this.answersService.upsertModule({
			sectionId: section.id,
			id: postQuizDataDto.paths.module.id,
			name: postQuizDataDto.paths.module.name,
		});

		return await Promise.all(
			postQuizDataDto.questionsData.map((questionData) => {
				return this.answersService.upsertQuestionAndCreateAnswer(
					module.id,
					questionData.question,
					questionData.answerOptions,
					{
						userId: user.id,
						percent: postQuizDataDto.percent,
						answers: questionData.answers,
					},
				);
			}),
		);
	}
}
