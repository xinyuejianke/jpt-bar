'use strict';

module.exports = {
  db: {
    database: 'lin_server',
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    username: 'root',
    password: 'admin',
    logging: false,
    timezone: '+08:00',
    define: {
      charset: 'utf8mb4'
    }
  },
  secret: '\x88W\xf09\x91\x07\x98\x89\x87\x96\xa0A\xc68\xf9\xecJJU\x17\xc5V\xbe\x8b\xef\xd7\xd8\xd3\xe6\x95*4', // 发布生产环境前，请务必修改此默认秘钥

  wechat: {
    appId: 'wx8636138567899dba',
    appSecret: '3ce68d007b9481669c15723d5abc766a',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
  }
};
