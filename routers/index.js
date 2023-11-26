const { Router } = require('express');
const { authRouter } = require('./auth.router.js');
const { userRouter } = require('./users.router.js');
const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);

module.exports = { apiRouter };
