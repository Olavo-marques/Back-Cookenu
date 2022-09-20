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
exports.UserData = void 0;
const baseDataBase_1 = __importDefault(require("./baseDataBase"));
class UserData extends baseDataBase_1.default {
    constructor() {
        super(...arguments);
        this.insertUserData = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .insert({
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmail(),
                    password: user.getPassword(),
                    role: user.getRole()
                })
                    .into("cookenu_back_users");
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.selectUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.getConnection()
                    .select("*")
                    .into("cookenu_back_users")
                    .where("email", email);
                return userFound;
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.selectUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.getConnection()
                    .select("*")
                    .into("cookenu_back_users")
                    .where({ id });
                return userFound;
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.removeUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .delete("*")
                    .into("cookenu_back_users")
                    .where("id", id);
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
}
exports.UserData = UserData;
