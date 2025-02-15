const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // generally the middleware is executed first, after it is completely executed
  // only then the control is handed over to the controlled. But here we want our
  // cache after the controller is totally executed. So we added async/await to 
  // next so that the process can be stopped here, controller executes and then
  // cache will be cleared
  await next();

  clearHash(req.user.id);
};
