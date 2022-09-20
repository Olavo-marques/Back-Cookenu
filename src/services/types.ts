import { Role } from "../model/UserBase";

export interface UserType {
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role
}

export interface RecipePersonType {
    id: string,
    title: string,
    description: string,
    postingDate: string,
    postingTime: string,
    idUser: string,
    nameUser: string
}

export interface RecipeType {
    id: string,
    title: string,
    description: string,
    posting_date: string,
    posting_time: string,
    last_update: string,
    user_id: string
}

export interface RecipeType {
    id: string,
    title: string,
    description: string,
    posting_date: string,
    posting_time: string,
    last_update: string,
    user_id: string
}

export interface FollowType {
    id: string,
    user_id_following: string,
    user_id_followed: string
}
