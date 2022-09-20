"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowData = void 0;
const baseDataBase_1 = __importDefault(require("./baseDataBase"));
class FollowData extends baseDataBase_1.default {
    constructor() {
        super(...arguments);
        this.followedUser = (id, idUserFollowing, idUserFollowed) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .insert({
                    id: id,
                    user_id_following: idUserFollowing,
                    user_id_followed: idUserFollowed
                })
                    .into("cookenu_back_follow");
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.selectFollowers = (idUserFollowing, idUserFollowed) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [followers] = yield this.getConnection().raw(`
                    select * 
                    from cookenu_back_follow 
                    where (user_id_following='${idUserFollowing}' and user_id_followed='${idUserFollowed}')
                `);
                return followers;
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.unfollowedUser = (idUserUnfollow, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .delete("*")
                    .from("cookenu_back_follow")
                    .where({
                    user_id_followed: idUserUnfollow,
                    user_id_following: userId
                });
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.deleteFollowedUser = (idUser) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .delete("*")
                    .from("cookenu_back_follow")
                    .where({ user_id_following: idUser });
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
}
exports.FollowData = FollowData;
