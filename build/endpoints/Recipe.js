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
exports.Recipe = void 0;
const RecipeData_1 = require("../data/RecipeData");
const UserData_1 = require("../data/UserData");
const RecipesBase_1 = require("../model/RecipesBase");
const UserBase_1 = require("../model/UserBase");
const Authenticator_1 = require("../services/Authenticator");
const GenerateId_1 = require("../services/GenerateId");
class Recipe {
    constructor() {
        this.createRecipe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const { title, description } = req.body;
                if (!title || !description) {
                    res.statusCode = 401;
                    throw new Error('Verifique todoso os campos antes do envio.');
                }
                const authorization = new Authenticator_1.Authenticator();
                const normalPassword = authorization.verifyToken(token);
                const userId = normalPassword.id;
                const userData = new UserData_1.UserData();
                const userSearched = yield userData.selectUserById(userId);
                if (!userSearched) {
                    res.statusCode = 500;
                    throw new Error('Erro no servidor.');
                }
                const Iduser = userSearched[0].id;
                const generateId = new GenerateId_1.GenerateId();
                const IdRecipe = generateId.generate();
                const date = new Date();
                const dateNow = date.toLocaleDateString();
                const timeNow = new Date().toLocaleTimeString();
                const new_date = dateNow.split("/");
                const deadlineInReverse = new_date.reverse();
                const deadlineForAmerican = deadlineInReverse.join("-");
                const newRecipe = new RecipesBase_1.RecipesBase(IdRecipe, title, description, deadlineForAmerican, timeNow, Iduser);
                const recipeData = new RecipeData_1.RecipeData();
                yield recipeData.insertRecipe(newRecipe);
                res.status(201).send("Receita criada com sucesso!");
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.getRecipeByid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const idRecipe = req.params.id;
                const token = req.headers.authorization;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                if (!idRecipe) {
                    res.statusCode = 401;
                    throw new Error('O id a ser buscado deve ser informado por params.');
                }
                const recipeData = new RecipeData_1.RecipeData();
                const recipeDataBase = yield recipeData.selectRecipeById(idRecipe);
                res.status(200).send(recipeDataBase);
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.geAlltRecipeByIdUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                const authorization = new Authenticator_1.Authenticator();
                const tokenId = authorization.verifyToken(token);
                const recipeData = new RecipeData_1.RecipeData();
                const recipeDataBase = yield recipeData.selectAllRecipeByIdUser(tokenId.id);
                if (!recipeDataBase.length) {
                    res.statusCode = 404;
                    throw new Error('Você ainda não criou nenhuma receita.');
                }
                res.status(200).send(recipeDataBase);
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.editRecipeById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const idRecipeParams = req.params.id;
                let title = req.body.title;
                let description = req.body.description;
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                const authorization = new Authenticator_1.Authenticator();
                const userIdToken = authorization.verifyToken(token);
                const recipeData = new RecipeData_1.RecipeData();
                const recipeDataBase = yield recipeData.selectRecipeById(idRecipeParams);
                if (recipeDataBase.idUser !== userIdToken.id) {
                    res.statusCode = 401;
                    throw new Error('Você pode editar apenas suas receitas.');
                }
                const titleDataBase = recipeDataBase.title;
                const descriptionDataBase = recipeDataBase.description;
                if (!title) {
                    title = titleDataBase;
                }
                if (!description) {
                    description = descriptionDataBase;
                }
                const dateNow = new Date().toLocaleDateString();
                yield recipeData.updateRecipeByIdUser(idRecipeParams, title, description, dateNow);
                res.status(200).send("Receita atualizada com sucesso!");
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
        this.deleteRecipeById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const idRecipeParams = req.params.id;
                if (!idRecipeParams) {
                    res.statusCode = 401;
                    throw new Error('Necessário informar o id da receita.');
                }
                if (!token) {
                    res.statusCode = 401;
                    throw new Error('Token deve ser passado nos headers.');
                }
                const authorization = new Authenticator_1.Authenticator();
                const userIdToken = authorization.verifyToken(token);
                const recipeData = new RecipeData_1.RecipeData();
                const recipeDataBase = yield recipeData.selectRecipeById(idRecipeParams);
                if (recipeDataBase === undefined) {
                    res.statusCode = 401;
                    throw new Error('Esse id não existe.');
                }
                if (userIdToken.role !== UserBase_1.Role.ADMIN && recipeDataBase.idUser !== userIdToken.id) {
                    res.statusCode = 401;
                    throw new Error('Autorização insulficiente.');
                }
                yield recipeData.deleteRecipeByIdUser(idRecipeParams);
                res.status(200).send("Receita revemovida com sucesso!");
            }
            catch (error) {
                res.status(res.statusCode || 500).send({ error: error.message });
            }
        });
    }
}
exports.Recipe = Recipe;
