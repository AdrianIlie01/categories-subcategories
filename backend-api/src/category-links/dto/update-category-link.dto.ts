import {IsNotEmpty} from "class-validator";

export class UpdateCategoryLinkDto {
    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    parent: string;
}
