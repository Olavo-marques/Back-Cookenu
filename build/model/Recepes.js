"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipes = void 0;
class Recipes {
    constructor(id, title, description, postingDate, postingTime, userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.postingDate = postingDate;
        this.postingTime = postingTime;
        this.userId = userId;
        this.getId = () => {
            return this.id;
        };
        this.getTitle = () => {
            return this.title;
        };
        this.getDescription = () => {
            return this.description;
        };
        this.getPostingDate = () => {
            return this.postingDate;
        };
        this.getPostingTime = () => {
            return this.postingTime;
        };
        this.getUserId = () => {
            return this.userId;
        };
    }
}
exports.Recipes = Recipes;
