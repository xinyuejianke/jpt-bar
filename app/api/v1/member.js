import { LinRouter, disableLoading } from 'lin-mizar';
import { MemberValidator } from '../../validator/member';
import { MemberDao } from '../../dao/member';
import { PositiveIdValidator } from '../../validator/common';
import { getSafeParamId } from '../../lib/util';
import { groupRequired } from '../../middleware/jwt';


const memberApi = new LinRouter({
  prefix: '/v1/member',
  module: 'member'
})

const memberDto = new MemberDao();

//Register a new member
memberApi.post('/', async (ctx) => {
  const v = await new MemberValidator().validate(ctx)
  ctx.json(await memberDto.createMember(v))
})

memberApi.linDelete(
  'deleteMember',
  '/:id',
  memberApi.permission('删除member'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await memberDto.deleteMember(id)
    ctx.success({ code: 20002 });
  }
)

memberApi.linGet(
  'getMember',
  '/:id',
  memberApi.permission('查看member信息'),
  async (ctx) => {
    await new PositiveIdValidator().validate(ctx)
    const id = getSafeParamId(ctx);
    const member = await memberDto.getMember(id)
    ctx.json(member)
  }
)

memberApi.linGet(
  'getAllMembers',
  '/list/all',
  memberApi.permission('访问当前用户所有的members'),
  groupRequired,
  async (ctx) => {
    ctx.json(await memberDto.getMembers())
  }
)

memberApi.linGet(
  'getAllMembers',
  '/list/all',
  memberApi.permission('访问所有members'),
  groupRequired,
  async (ctx) => {
    ctx.json(await memberDto.getMembers())
  }
)

memberApi.put('/:id', async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  const id = getSafeParamId(ctx);
  await memberDto.updateMember(v, id)

  ctx.success({ code: 20003 })
})


module.exports = { memberApi, [disableLoading]: false };
