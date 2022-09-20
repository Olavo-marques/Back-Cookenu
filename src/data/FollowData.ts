import { FollowType } from "../services/types";
import BaseDataBase from "./baseDataBase";

export class FollowData extends BaseDataBase {
    followedUser = async (
        id: string,
        idUserFollowing: string,
        idUserFollowed: string
    ): Promise<void> => {
        try {
            await this.getConnection()
                .insert({
                    id: id,
                    user_id_following: idUserFollowing,
                    user_id_followed: idUserFollowed
                })
                .into("cookenu_back_follow")

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    selectFollowers = async (idUserFollowing: string, idUserFollowed: string): Promise<FollowType[]> => {
        try {
            const [followers] = await this.getConnection().raw(`
                    select * 
                    from cookenu_back_follow 
                    where (user_id_following='${idUserFollowing}' and user_id_followed='${idUserFollowed}')
                `)

            return followers

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    unfollowedUser = async (idUserUnfollow: string, userId: string): Promise<void> => {
        try {
            await this.getConnection()
                .delete("*")
                .from("cookenu_back_follow")
                .where({
                    user_id_followed: idUserUnfollow,
                    user_id_following: userId
                })

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    deleteFollowedUser = async (idUser: string): Promise<void> => {
        try {
            await this.getConnection()
                .delete("*")
                .from("cookenu_back_follow")
                .where({ user_id_following: idUser })

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}