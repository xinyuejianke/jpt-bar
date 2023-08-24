import { LinRouter } from 'lin-mizar';
import { TokenValidator, UpdateInfoValidator } from '../../validator/user';
import { PositiveIdValidator } from '../../validator/common'
import { UserDao } from '../../dao/user';
import { groupRequired } from '../../middleware/jwt';
import { logger } from 'lin-mizar';

const userApi = new LinRouter({
  prefix: '/v1/wechat',
  module: 'wechat',
});

const userDao = new UserDao();

userApi.post('/token', async ctx => {
  const v = await new TokenValidator().validate(ctx)
  ctx.body = await userDao.registerWechatUser(v)
})

userApi.linPut(
  'updateWechatUser',
  '/',
  userApi.permission('更新微信用户信息'),
  groupRequired,
  async ctx => {
    const v = await new UpdateInfoValidator().validate(ctx)
    await userDao.updateWechatUser(ctx, v)
    ctx.success({
      code: 6
    })
  }
)

userApi.linGet(
  'getInformation',
  '/user/:id',
  userApi.permission('查询自己信息'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx)
    const userId = v.get('path.id')
    logger.debug(`user_id: ${userId}`)
    const info = await userDao.getWechatUser(userId)
    ctx.json(info);
  }
)

export { userApi };
