import {IsNotEmpty} from "class-validator";

export class UpdateCategoryDto {
    @IsNotEmpty()
    category_name: string;

    @IsNotEmpty()
    description:string
}