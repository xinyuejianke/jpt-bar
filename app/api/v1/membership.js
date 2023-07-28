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

membershipApi.post('/', async ctx => {
  const v = await new MembershipValidator().validate(ctx)
  await membershipDto.createMembership(v)
  ctx.success({ code: 30001 })
})

membershipApi.linDelete(
  'deleteMembership',
  '/:id',
  membershipApi.permission('删除membership'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await membershipDto.deleteMembership(id)
    ctx.success({ code: 30002 });
  }
)

membershipApi.get('/:id', async ctx => {
  await new PositiveIdValidator().validate(ctx)
  const userId = getSafeParamId(ctx);
  const members = await membershipDto.getAllMembers(userId)

  ctx.json(members)
})

module.exports = { membershipApi, [disableLoading]: false };
