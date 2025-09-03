import { types } from '@typegoose/typegoose';

export abstract class CRUD_Service<UsedModel, Schema> {
    abstract getmodel(): UsedModel;

    abstract create(...args: any[]): Promise<types.DocumentType<Schema>>;
    abstract read(
        ...args: any[]
    ): Promise<{
        result: types.DocumentType<Schema>[] | Schema[];
        total: number;
        pagination: Pagination;
    }>;
    abstract read_by_sequence(
        ...args: any[]
    ): Promise<types.DocumentType<Schema> | Schema | null>;
    abstract update(
        ...args: any[]
    ): Promise<types.DocumentType<Schema> | Schema | null>;
    abstract activate(
        ...args: any[]
    ): Promise<types.DocumentType<Schema> | Schema | null>;
    abstract deactivate(
        ...args: any[]
    ): Promise<types.DocumentType<Schema> | Schema | null>;
}
