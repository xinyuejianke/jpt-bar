import { LinRouter } from 'lin-mizar';
import { TokenValidator } from '../../validator/user';
import { PositiveIdValidator } from '../../validator/common'
import { UserDao } from '../../dao/user';
import { groupRequired } from '../../middleware/jwt';

const userApi = new LinRouter({
  prefix: '/v1/wechat',
  module: 'wechat',
});

const userDao = new UserDao();

userApi.post('/token', async ctx => {
  const v = await new TokenValidator().validate(ctx)
  ctx.body = await userDao.registerWechatUser(v)
})

userApi.linGet(
  'getInformation',
  '/user/:id',
  userApi.permission('查询自己信息'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx)
    const info = await userDao.getWechatUser(v)
    ctx.json(info);
  }
)

export { userApi };
