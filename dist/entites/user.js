"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleandFaceebookSignInUserEntity = void 0;
function userEntity(name, email, password, role) {
    return {
        getName: () => name,
        getEmail: () => email,
        getPassword: () => password,
        getUserRole: () => role
    };
}
exports.default = userEntity;
function GoogleandFaceebookSignInUserEntity(name, email, picture, email_verified, role) {
    return {
        name: () => name,
        email: () => email,
        picture: () => picture,
        email_verified: () => email_verified,
        getUserRole: () => role
    };
}
exports.GoogleandFaceebookSignInUserEntity = GoogleandFaceebookSignInUserEntity;
