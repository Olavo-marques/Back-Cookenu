"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBase = exports.Role = void 0;
var Role;
(function (Role) {
    Role["NORMAL"] = "NORMAL";
    Role["ADMIN"] = "ADMIN";
})(Role = exports.Role || (exports.Role = {}));
class UserBase {
    constructor(id, name, email, password, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.getId = () => {
            return this.id;
        };
        this.getName = () => {
            return this.name;
        };
        this.getEmail = () => {
            return this.email;
        };
        this.getPassword = () => {
            return this.password;
        };
        this.getRole = () => {
            return this.role;
        };
    }
}
exports.UserBase = UserBase;
