import {BaseEntity, BeforeInsert, BeforeUpdate, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CategoryEntity} from "../../category/entities/category.entity";
import {BadRequestException} from "@nestjs/common";


@Entity('category_links')
export class CategoryLinkEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CategoryEntity, (category_entity) => category_entity.category_link, {nullable: false})
    category: CategoryEntity


    @ManyToOne(() => CategoryEntity, (category_entity) => category_entity.category_link, {nullable: false})
    parent: CategoryEntity


    @BeforeInsert()
    async insertCategoryLink(){
        const existingCategoryLink = await CategoryLinkEntity.find({where: {category: this.category, parent: this.parent}});
        if (existingCategoryLink.length > 0) {
            throw new BadRequestException('This category link already exists');
        }

    }
    @BeforeUpdate()
    async updateCategoryLink(){
        const existingCategoryLink = await CategoryLinkEntity.find({where: {category: this.category, parent: this.parent}});
        if (existingCategoryLink.length > 0) {
            throw new BadRequestException('This category link already exists');
        }

    }

    @BeforeInsert()
    async insertSame(){
        if (this.category.id === this.parent.id) {
            throw new BadRequestException(`Invalid category link with category ${this.category.category_name} and parent ${this.parent.category_name}`);
        }
    }
    @BeforeUpdate()
    async UpdateSame(){
        if (this.category.category_name === this.parent.category_name) {
            throw new BadRequestException(`Invalid category link with category ${this.category.category_name} and parent ${this.parent.category_name}`);
        }
    }

}

