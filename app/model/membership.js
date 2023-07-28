import { Sequelize, Model } from 'sequelize'
import sequelize from '../lib/db';
import { merge } from 'lodash';
import { InfoCrudMixin } from 'lin-mizar';
import { MemberModel } from './member';
import { UserModel } from './user';

class MembershipModel extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      userId: this.userId,
      memberId: this.memberId,
    };
    return origin;
  }
}

MembershipModel.init(
  {
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    memberId: {
      type: Sequelize.INTEGER,
      references: {
        model: MemberModel,
        key: 'id'
      }
    }
  },
  merge(
    {
      sequelize,
      tableName: 'membership',
      modelName: 'membership',
      collate: 'utf8mb4_general_ci'
    },
    InfoCrudMixin.options
  )
)

UserModel.belongsToMany(MemberModel, { through: MembershipModel });
MemberModel.belongsToMany(UserModel, { through: MembershipModel });

export { MembershipModel };
