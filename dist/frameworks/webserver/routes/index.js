"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("./admin"));
const auth_1 = __importDefault(require("./user/auth"));
const owner_1 = __importDefault(require("./owner"));
const routes = (app) => {
    app.use("/api/user", (0, auth_1.default)());
    app.use("/api/owners", (0, owner_1.default)());
    app.use("/api/admin", (0, admin_1.default)());
};
exports.default = routes;
