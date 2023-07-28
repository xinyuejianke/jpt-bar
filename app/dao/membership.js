import { NotFound } from 'lin-mizar';
import { MemberModel } from '../model/member.js'
import { MembershipModel } from '../model/membership.js';
import { UserModel } from '../model/user.js';
import { Op } from 'sequelize'


class MembershipDao {

  async getAllMembers(userId) {
    const membership = await MembershipModel.findAll({ where: { userId } })
    let memberIds = []
    for (let m of membership) {
      memberIds.push(m.getDataValue('memberId'))
    }
    return await MemberModel.findAll({ where: { id: { [Op.in]: memberIds } } })
  }

  async createMembership(v) {
    const membership = new MembershipModel()

    membership.userId = v.get('body.user_id')
    const user = await UserModel.findOne({ where: { id: membership.userId } })
    if (!user) {
      throw new NotFound({ code: 10021 })
    }

    membership.memberId = v.get('body.member_id')
    const member = await MemberModel.findOne({ where: { id: membership.memberId } })
    if (!member) {
      throw new NotFound({ code: 20404 })
    }
    await membership.save();
  }

  async deleteMembership(id) {
    const membership = await MembershipModel.findOne({ where: { id } })

    if (!membership) {
      throw new NotFound({ code: 30404 });
    }
    membership.destroy();
  }
}

export { MembershipDao };
