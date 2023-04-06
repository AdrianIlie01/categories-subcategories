import {IsNotEmpty} from "class-validator";

export class CreateCategoryLinkDto {
    @IsNotEmpty({message: 'Category must not be empty'})
    category: string;

    @IsNotEmpty({message: 'Parent must not be empty'})
    parent: string;

}
