import { Sequelize, Model } from 'sequelize'
import sequelize from '../lib/db';
import { merge } from 'lodash';
import { InfoCrudMixin } from 'lin-mizar';

class MemberModel extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      nickname: this.nickname,
      gender: this.gender,
      birthday: this.birthday,
    };
    return origin;
  }
}

MemberModel.init(
  {
    nickname: Sequelize.STRING,
    gender: Sequelize.CHAR,
    birthday: Sequelize.DATEONLY,
  },
  merge(
    {
      sequelize,
      tableName: 'member',
      modelName: 'member',
      collate: 'utf8mb4_general_ci'
    },
    InfoCrudMixin.options
  )
)

export { MemberModel };
