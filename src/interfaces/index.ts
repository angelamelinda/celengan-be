export interface IDefaultResponse {
    message: string;
    status: number;
}

export interface ICategory {
    id: string;
    name: string;
    created_by: string;
}

export interface IUser {
    username: string;
    email: string;
    password?: string;
    created_date: string;
    updated_date: string;
}

export interface IUserJWT extends IUser {
    id: string;
}

export interface IBudget {
    category_id: number;
    amount: number;
    start_date: string;
    end_date: string;
}