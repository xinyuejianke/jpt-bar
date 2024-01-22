import { AuthFailed, NotFound, Forbidden } from 'lin-mizar';
import { MemberModel } from '../model/member.js'
import { MembershipModel } from '../model/membership.js';
import { UserModel } from '../model/user.js';
import { Op } from 'sequelize'
import sequelize from '../lib/db.js';


class MembershipDao {

  async getAllMembers(userId) {
    const membership = await MembershipModel.findAll({ where: { userId } })
    let memberIds = []
    for (let m of membership) {
      memberIds.push(m.getDataValue('memberId'))
    }
    return await MemberModel.findAll({ where: { id: { [Op.in]: memberIds } } })
  }


  async createMembership(userId, memberId) {
    const membership = new MembershipModel()

    membership.userId = userId
    const user = await UserModel.findOne({ where: { id: membership.userId } })
    if (!user) {
      throw new NotFound({ code: 10021 })
    }

    membership.memberId = memberId
    const member = await MemberModel.findOne({ where: { id: membership.memberId } })
    if (!member) {
      throw new NotFound({ code: 20404 })
    }

    await membership.save()
  }

  async bindExistedMember(info) {
    const membershipInfo = {
      userId: info.get("body.user_id"),
      memberId: info.get("body.member_id"),
      nickname: info.get("body.nickname"),
      birthday: info.get("body.birthday")
    }

    //check member available
    const member = await MemberModel.findOne({ where: { id: membershipInfo.memberId }})
    if (!member) {
      throw new NotFound({ code: 20404 })
    }
    //verify member info (birthday and nickname)
    if (member.birthday != membershipInfo.birthday || member.nickname != membershipInfo.nickname) {
      throw new AuthFailed({ code: 20401 })
    }
    //check membership is existed
    const membership = await MembershipModel.findOne({ where: {userId: membershipInfo.userId, memberId: membershipInfo.memberId}})
    if (membership) {
      throw new Forbidden({ code: 30403 })
    }
    await this.createMembership(membershipInfo.userId, membershipInfo.memberId)
  }

  async deleteMembership(userId, memberId) {
    const membership = await MembershipModel.findOne({ where: { userId, memberId } })

    if (!membership) {
      throw new NotFound({ code: 30404 });
    }
    // membership.destroy();
    sequelize.transaction(async t => {
      await membership.destroy({ force: true, transaction: t })
    })
  }
}

export { MembershipDao };
