import {BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CategoryLinkEntity} from "../../category-links/entities/category-link.entity";
import {BadRequestException} from "@nestjs/common";

@Entity('category')
export class CategoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true})
    category_name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @OneToMany(() => CategoryLinkEntity, (category_link) => category_link.category)
    category_link: CategoryLinkEntity[]

    @BeforeInsert()
    async insertName(){
        const category = await CategoryEntity.find({where:{category_name: this.category_name}});
        if (category.length > 0) {
            throw new BadRequestException('This category name already exists');
        }

    }

}