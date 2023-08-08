import { NotFound } from 'lin-mizar';
import { MemberModel } from '../model/member.js'


class MemberDao {

  async getMember(id) {
    const member = await MemberModel.findOne({ where: { id } })
    if (!member) {
      throw new NotFound({ code: 10022 });
    }
    return member
  }

  async getMembers() {
    return await MemberModel.findAll();
  }

  async createMember(v) {
    const member = new MemberModel();
    member.nickname = v.get('body.nickname');
    member.gender = v.get('body.gender');
    member.birthday = v.get('body.birthday')

    return await member.save();
  }

  async updateMember(v, id) {
    const member = await MemberModel.findByPk(id);
    if (!member) {
      throw new NotFound({ code: 10022 });
    }
    member.nickname = v.get('body.nickname');
    member.gender = v.get('body.gender');
    member.birthday = v.get('body.birthday')

    await member.save();
  }

  async deleteMember(id) {
    const member = await MemberModel.findOne({ where: { id } });
    if (!member) {
      throw new NotFound({ code: 10022 });
    }
    member.destroy();
  }
}

export { MemberDao };
