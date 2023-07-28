import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsDefined,
	IsNotEmpty,
	IsNotEmptyObject,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';

export class QuestionDataDto {
	@IsString()
	@IsNotEmpty()
	question: string;

	@IsArray()
	@IsString({ each: true })
	answerOptions: string[];

	@IsArray()
	@IsString({ each: true })
	answers: string[];
}

export class PathDto {
	@IsNumber()
	@Min(1)
	id: number;

	@IsString()
	@IsNotEmpty()
	name: string;
}

export class PathsDto {
	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => PathDto)
	course: PathDto;

	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => PathDto)
	section: PathDto;

	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => PathDto)
	module: PathDto;
}

export class PostQuizDataDto {
	@IsNumber()
	@Min(1)
	userId: number;

	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => PathsDto)
	paths: PathsDto;

	@IsNumber()
	@IsOptional()
	@Min(0)
	@Max(100)
	percent?: number | null;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => QuestionDataDto)
	questionsData: QuestionDataDto[];
}
