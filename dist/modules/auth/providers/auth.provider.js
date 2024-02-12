"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProviders = exports.FORGOT_MODEL_PROVIDER = exports.VERIFICATION_MODEL_PROVIDER = exports.OAUTH_LOGIN_MODEL_PROVIDER = exports.AUTH_SESSION_MODEL_PROVIDER = exports.AUTH_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.AUTH_MODEL_PROVIDER = 'AUTH_MODEL';
exports.AUTH_SESSION_MODEL_PROVIDER = 'AUTH_SESSION_MODEL_PROVIDER';
exports.OAUTH_LOGIN_MODEL_PROVIDER = 'OAUTH_LOGIN_MODEL_PROVIDER';
exports.VERIFICATION_MODEL_PROVIDER = 'VERIFICATION_MODEL_PROVIDER';
exports.FORGOT_MODEL_PROVIDER = 'FORGOT_MODEL_PROVIDER';
exports.authProviders = [
    {
        provide: exports.AUTH_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Auth', schemas_1.AuthSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.VERIFICATION_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Verification', schemas_1.VerificationSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.FORGOT_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Forgot', schemas_1.ForgotSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.OAUTH_LOGIN_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('OAuthLogin', schemas_1.OAuthLoginSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.AUTH_SESSION_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('AuthSession', schemas_1.AuthSessionSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=auth.provider.js.map