export interface RepositoryInterface<T, E> {
    create(entity: T): Promise<E>;
    delete(id: string): Promise<void>;
    find(id: string): Promise<E>;
    findAll(): Promise<E[]>;
    update(entity: T): Promise<void>;
}
