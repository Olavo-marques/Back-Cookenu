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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = void 0;
const FollowData_1 = require("../data/FollowData");
const UserData_1 = require("../data/UserData");
const Authenticator_1 = require("../services/Authenticator");
const GenerateId_1 = require("../services/GenerateId");
class Follow {
    constructor() {
        this.userFollow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUserFollow } = req.body;
                const token = req.headers.authorization;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                if (!idUserFollow) {
                    res.statusCode = 401;
                    throw new Error('O id a ser buscado deve ser informado.');
                }
                const authorization = new Authenticator_1.Authenticator();
                const payload = authorization.verifyToken(token);
                const userId = payload.id;
                const userData = new UserData_1.UserData();
                const userDataBase = yield userData.selectUserById(userId);
                const idUserFollowing = userDataBase[0].id;
                const nameUserFollowing = userDataBase[0].name;
                const userDataBaseFollowed = yield userData.selectUserById(idUserFollow);
                if (!userDataBaseFollowed.length) {
                    res.statusCode = 409;
                    throw new Error(`O usuário que deseja seguir não foi encontrado.`);
                }
                let idUserFollowed = userDataBaseFollowed[0].id;
                const nameUserFollowed = userDataBaseFollowed[0].name;
                const generateId = new GenerateId_1.GenerateId();
                const id = generateId.generate();
                const followData = new FollowData_1.FollowData();
                const followers = yield followData.selectFollowers(idUserFollowing, idUserFollowed);
                if (followers.length) {
                    res.statusCode = 409;
                    throw new Error(`Você já segue ${nameUserFollowed}.`);
                }
                if (idUserFollowed === idUserFollowing) {
                    res.statusCode = 409;
                    throw new Error(`Você não poode seguir a si mesmo.`);
                }
                yield followData.followedUser(id, idUserFollowing, idUserFollowed);
                res.status(201).send(`${nameUserFollowing} agora esta seguindo o ${nameUserFollowed}!`);
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.userUnfollow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUserUnfollow } = req.body;
                const token = req.headers.authorization;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                if (!idUserUnfollow) {
                    res.statusCode = 401;
                    throw new Error('O id a ser buscado deve ser informado.');
                }
                const authorization = new Authenticator_1.Authenticator();
                const normalPassword = authorization.verifyToken(token);
                const userId = normalPassword.id;
                const userData = new UserData_1.UserData();
                const userUnfollowDb = yield userData.selectUserById(idUserUnfollow);
                const nameUnfollowDb = userUnfollowDb[0].name;
                const followData = new FollowData_1.FollowData();
                yield followData.unfollowedUser(idUserUnfollow, userId);
                res.status(201).send(`Você paraou de seguir ${nameUnfollowDb}!`);
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
    }
}
exports.Follow = Follow;
