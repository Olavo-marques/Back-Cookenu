

export enum Role {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export class UserBase {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private role: Role
    ) { }

    public getId = () => {
        return this.id
    }
    public getName = () => {
        return this.name
    }
    public getEmail = () => {
        return this.email
    }
    public getPassword = () => {
        return this.password
    }
    public getRole = () => {
        return this.role
    }
}