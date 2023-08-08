'use strict';

require('dotenv').config('../../.env')
module.exports = {
  db: {
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: 'mysql',
    port: 3306,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    logging: false,
    timezone: '+08:00',
    define: {
      charset: 'utf8mb4'
    }
  },
  secret: process.env.SECRET, // 发布生产环境前，请务必修改此默认秘钥

  wechat: {
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    loginUrl: process.env.LOGIN_URL,
  }
};
