export class RecipesBase {
    constructor(
        private id: string,
        private title: string,
        private description: string,
        private postingDate: string,
        private postingTime: string,
        private userId: string
    ) { }
    public getId = () => {
        return this.id
    }
    public getTitle = () => {
        return this.title
    }
    public getDescription = () => {
        return this.description
    }
    public getPostingDate = () => {
        return this.postingDate
    }
    public getPostingTime = () => {
        return this.postingTime
    }
    public getUserId = () => {
        return this.userId
    }
}