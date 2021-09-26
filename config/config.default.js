/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1629102150931_8868';

  // add your middleware config here
  // add your middleware config here
  config.middleware = [ ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'rm-0xi04z3d7bn0g5q27vo.mysql.rds.aliyuncs.com',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: 'Hit@314159',
      // database
      database: 'my-site',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.security = {
    csrf: { enable: false },
    domainWhiteList: [ '*' ],
  };
  config.cors = {
    credentials: true, // 允许Cook可以跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  config.jwt = {
    // 密钥:自己设置的值
    secret: 'demo',
    ignore: [ '/admin/checkLogin', '/default/' ], // 只忽略指定路由，可以用ignore
  };
  config.bodyParser = {
    jsonLimit: '100mb',
  };

  return {
    ...config,
    ...userConfig,
  };
};
