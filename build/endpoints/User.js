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
exports.User = void 0;
const FollowData_1 = require("../data/FollowData");
const RecipeData_1 = require("../data/RecipeData");
const UserData_1 = require("../data/UserData");
const UserBase_1 = require("../model/UserBase");
const Authenticator_1 = require("../services/Authenticator");
const GenerateId_1 = require("../services/GenerateId");
const HashManager_1 = require("../services/HashManager");
class User {
    constructor() {
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, role } = req.body;
                if (!name || !email || !password) {
                    res.statusCode = 401;
                    throw new Error('Revise todos os campos a serem enviados.');
                }
                const userData = new UserData_1.UserData();
                const verifyEmailexist = yield userData.selectUserByEmail(email);
                if (verifyEmailexist.length) {
                    res.statusCode = 409;
                    throw new Error('Email já cadastrado no banco de dados.');
                }
                const hashManager = new HashManager_1.HashManager();
                const hashPassword = yield hashManager.hash(password);
                const generateId = new GenerateId_1.GenerateId();
                const id = generateId.generate();
                const newUser = new UserBase_1.UserBase(id, name, email, hashPassword, role);
                yield userData.insertUserData(newUser);
                const payload = {
                    id,
                    role
                };
                const authenticator = new Authenticator_1.Authenticator();
                const token = authenticator.generateToken(payload);
                res.status(201).send({ message: 'Usuário criado com sucesso!', token });
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.statusCode = 401;
                    throw new Error('Preencha todos os campos antes do envio.');
                }
                const userData = new UserData_1.UserData();
                const userDataBase = yield userData.selectUserByEmail(email);
                const idDataBase = userDataBase[0].id;
                const emailDataBase = userDataBase[0].email;
                const hashDataBase = userDataBase[0].password;
                const roleDataBase = userDataBase[0].role;
                const hashManager = new HashManager_1.HashManager();
                const hashIsValid = yield hashManager.compare(password, hashDataBase);
                if (email !== emailDataBase || hashIsValid === false) {
                    res.statusCode = 401;
                    throw new Error('Credencias incorretas.');
                }
                const payload = {
                    id: idDataBase,
                    role: roleDataBase
                };
                const authenticator = new Authenticator_1.Authenticator();
                const token = authenticator.generateToken(payload);
                res.status(200).send({ token });
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                const authorization = new Authenticator_1.Authenticator();
                const normalPassword = authorization.verifyToken(token);
                if (!normalPassword) {
                    res.statusCode = 401;
                    throw new Error('token invalid.');
                }
                const userId = normalPassword.id;
                if (!userId) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                const userData = new UserData_1.UserData();
                const userDataBase = yield userData.selectUserById(userId);
                if (!userDataBase) {
                    res.statusCode = 404;
                    throw new Error('Usuário não encontrado.');
                }
                const id = userDataBase[0].id;
                const name = userDataBase[0].name;
                const email = userDataBase[0].email;
                res.status(200).send({ id, name, email });
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const idParams = req.params.id;
                const token = req.headers.authorization;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                if (!idParams) {
                    res.statusCode = 404;
                    throw new Error('O id a ser buscado deve ser informado por params.');
                }
                const userData = new UserData_1.UserData();
                const userSearched = yield userData.selectUserById(idParams);
                if (!userSearched) {
                    res.statusCode = 404;
                    throw new Error('Usuário não encontrado.');
                }
                const id = userSearched[0].id;
                const name = userSearched[0].name;
                const email = userSearched[0].email;
                res.status(200).send({ id, name, email });
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.deleteUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUSerForRemove } = req.body;
                const token = req.headers.authorization;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                if (!idUSerForRemove) {
                    res.statusCode = 404;
                    throw new Error('informe o id do usuário a ser removido.');
                }
                const authenticator = new Authenticator_1.Authenticator();
                const payload = authenticator.verifyToken(token);
                const userData = new UserData_1.UserData();
                const userDataBase = yield userData.selectUserById(idUSerForRemove);
                if (!userDataBase.length) {
                    res.statusCode = 404;
                    throw new Error('Usuário não encontrado.');
                }
                if (payload.role !== UserBase_1.Role.ADMIN) {
                    res.statusCode = 401;
                    throw new Error('Autorização insulficiente, somente um ADM pode executar essa função.');
                }
                const follow = new FollowData_1.FollowData();
                yield follow.deleteFollowedUser(idUSerForRemove);
                const recipeData = new RecipeData_1.RecipeData();
                yield recipeData.deleteAllRecipeUser(idUSerForRemove);
                yield userData.removeUserById(idUSerForRemove);
                res.status(200).send('Todas as informações deste usuário foram removido!');
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
    }
}
exports.User = User;
