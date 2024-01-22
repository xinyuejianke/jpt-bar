import { LinRouter, disableLoading } from 'lin-mizar';
import { PositiveIdValidator } from '../../validator/common';
import { MembershipValidator } from '../../validator/membership';
import { getSafeParamId } from '../../lib/util';
import { groupRequired } from '../../middleware/jwt';
import { MembershipDao } from '../../dao/membership';


const membershipApi = new LinRouter({
  prefix: '/v1/membership',
  module: 'membership'
})

const membershipDto = new MembershipDao()

membershipApi.linPost(
  'buildMembership',
  '/',
  membershipApi.permission('绑定成员'),
  groupRequired,
  async ctx => {
    const v = await new MembershipValidator().validate(ctx)
    await membershipDto.createMembership(v.get('body.user_id'), v.get('body.member_id'))
    ctx.success({ code: 30001 })
  }
)

membershipApi.linPost(
  'bindExistedMember',
  '/bind',
  membershipApi.permission('绑定已存在成员'),
  groupRequired,
  async ctx => {
    const v = await new MembershipValidator().validate(ctx);
    await membershipDto.bindExistedMember(v)
    ctx.success({code: 2})
  }
)

membershipApi.linDelete(
  'deleteMembership',
  '/',
  membershipApi.permission('解绑成员'),
  groupRequired,
  async ctx => {
    const v = await new MembershipValidator().validate(ctx);
    await membershipDto.deleteMembership(v.get('body.user_id'), v.get('body.member_id'))
    ctx.success({ code: 3 });
  }
)

membershipApi.linGet(
  'getMembershipByUser',
  '/:id',
  membershipApi.permission('访问用户绑定的membership'),
  groupRequired,
  async ctx => {
    await new PositiveIdValidator().validate(ctx)
    const userId = getSafeParamId(ctx);
    const members = await membershipDto.getAllMembers(userId)

    ctx.json(members)
  }
)

module.exports = { membershipApi, [disableLoading]: false };
