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
exports.RecipeData = void 0;
const baseDataBase_1 = __importDefault(require("./baseDataBase"));
class RecipeData extends baseDataBase_1.default {
    constructor() {
        super(...arguments);
        this.insertRecipe = (recipesBase) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .insert({
                    id: recipesBase.getId(),
                    title: recipesBase.getTitle(),
                    description: recipesBase.getDescription(),
                    posting_date: recipesBase.getPostingDate(),
                    posting_time: recipesBase.getPostingTime(),
                    user_id: recipesBase.getUserId()
                })
                    .into("cookenu_back_recipes");
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.selectRecipeById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [recipes] = yield this.getConnection()
                    .from("cookenu_back_recipes")
                    .select("cookenu_back_recipes.id", "cookenu_back_recipes.title", "cookenu_back_recipes.description", "cookenu_back_recipes.posting_date as postingDate", "cookenu_back_recipes.posting_time as postingTime", "cookenu_back_users.id as idUser", "cookenu_back_users.name as nameUser")
                    .join("cookenu_back_users", "cookenu_back_recipes.user_id", "cookenu_back_users.id")
                    .where("cookenu_back_recipes.id", id);
                return recipes;
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.selectAllRecipeByIdUser = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield this.getConnection()
                    .from("cookenu_back_recipes")
                    .select("*")
                    .where("user_id", id);
                return recipes;
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.updateRecipeByIdUser = (idRecipeParams, title, description, dateNow) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection().raw(`
                update cookenu_back_recipes
                set title="${title}", description="${description}" , last_update="${dateNow}"
                where id='${idRecipeParams}'
            `);
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.deleteRecipeByIdUser = (idRecipeParams) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .from("cookenu_back_recipes")
                    .delete("*")
                    .where("id", idRecipeParams);
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
        this.deleteAllRecipeUser = (idUser) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConnection()
                    .delete("*")
                    .from("cookenu_back_recipes")
                    .where({ user_id: idUser });
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
}
exports.RecipeData = RecipeData;
