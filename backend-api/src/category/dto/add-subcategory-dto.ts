import {IsNotEmpty} from "class-validator";

export class AddSubcategoryDto {
    @IsNotEmpty({message: 'Category id must not be empty'})
    categoryId: number;
}
