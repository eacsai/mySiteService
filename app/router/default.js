/* eslint-disable strict */
module.exports = app => {
  const { router, controller } = app;
  router.get('/default/index', controller.default.home.index);
  router.get('/default/getArticleList', controller.default.home.getArticleList);
  router.post('/default/sign',controller.default.home.sign);
  router.post('/default/login',controller.default.home.login);
  router.post('/default/avatar',controller.default.home.avatar);
  router.post('/default/addComment',controller.default.home.addComment);
  router.get('/default/getComment', controller.default.home.getComment);
  router.get('/default/getPic', controller.default.home.getPic);
};
