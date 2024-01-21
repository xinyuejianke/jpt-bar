import { LinRouter, disableLoading } from 'lin-mizar';
import { MemberValidator } from '../../validator/member';
import { MemberDao } from '../../dao/member';
import { PositiveIdValidator } from '../../validator/common';
import { getSafeParamId } from '../../lib/util';
import { adminRequired, groupRequired } from '../../middleware/jwt';
import { MemberModel } from '../../model/member';


const memberApi = new LinRouter({
  prefix: '/v1/member',
  module: 'member'
})

const memberDto = new MemberDao();

//Register a new member
memberApi.linPost(
  'createMember',
  '/',
  memberApi.permission('新增member'),
  groupRequired,
  async (ctx) => {
    const v = await new MemberValidator().validate(ctx)
    ctx.success({
      code: 1,
      member: await memberDto.createMember(v)
    })
  })

memberApi.linDelete(
  'deleteMember',
  '/:id',
  memberApi.permission('删除member'),
  groupRequired,
  async ctx => {
    await new PositiveIdValidator().validate(ctx);
    const id = getSafeParamId(ctx);
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
  memberApi.permission('访问所有members'),
  adminRequired,
  async (ctx) => {
    ctx.json(await MemberModel.findAll())
  }
)

memberApi.put('/:id', async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  const id = getSafeParamId(ctx);
  await memberDto.updateMember(v, id)

  ctx.success({ code: 20003 })
})


module.exports = { memberApi, [disableLoading]: false };
