// IncentivoFlow/config/admin.js

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import User from '../models/user.js';
import { Router } from 'express';

// Registrar o adaptador do Sequelize
AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
    resources: [User],
    rootPath: process.env.ADMINJS_ROOT_PATH,
});

const router = Router();

const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
        if (email === process.env.ADMINJS_USERNAME && password === process.env.ADMINJS_PASSWORD) {
            return Promise.resolve({ email });
        }
        return Promise.reject();
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
});

router.use(adminJs.options.rootPath, adminJsRouter);

export default router;
