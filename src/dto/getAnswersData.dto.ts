import { IsNotEmpty, IsNumber, IsString, Max, Min, ValidateIf } from 'class-validator';

export class GetAnswersDataDto {
	@IsNumber()
	@ValidateIf((object, value) => value !== undefined)
	@Min(1)
	moduleId?: number;

	@IsString()
	@IsNotEmpty()
	question_questionType_answerOptions_md5: string;

	@IsNumber()
	@ValidateIf((object, value) => value !== undefined)
	@Min(1)
	skip?: number;

	@IsNumber()
	@ValidateIf((object, value) => value !== undefined)
	@Min(1)
	@Max(10)
	take?: number;
}
