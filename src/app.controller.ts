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
	getAnswersData(@Query() { moduleId, question_questionType_answerOptions_md5, skip, take }: GetAnswersDataDto) {
		return this.answersService.getAnswersGroupedByQuestion(
			{
				moduleId,
				question_questionType_answerOptions_md5,
			},
			{ skip, take },
		);
	}

	@Post('postQuizData')
	@Throttle(3, 60)
	postQuizData(
		@Body() { userId, paths: { course, section, module }, percent, questionsData }: PostQuizDataDto,
		@Ip() ip: string,
	) {
		return this.answersService.upsertUserPathsQuestionAndCreateAnswers(
			{
				id: userId,
				lastIp: ip,
			},
			{
				id: course.id,
				name: course.name,
			},
			{
				sectionId: section.id,
				name: section.name,
			},
			{
				id: module.id,
				name: module.name,
			},
			percent,
			questionsData,
		);
	}
}
