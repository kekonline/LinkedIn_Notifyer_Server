import { IsString, IsIn } from 'class-validator';

export class MarkJobDto {
    @IsString()
    @IsIn(['seen', 'starred']) // Only allow 'seen' or 'starred' values
    markAs: 'seen' | 'starred';
}
