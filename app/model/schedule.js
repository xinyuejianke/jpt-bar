import { Sequelize, Model } from 'sequelize'
import sequelize from '../lib/db';
import { merge } from 'lodash';
import { InfoCrudMixin } from 'lin-mizar';
import { UserModel } from './user';

class ScheduleModel extends Model {

  toJSON() {
    const origin = {
      id: this.id,
      user: this.user,
      date: this.date,
      times: this.times,
      availableTimes: this.availableTimes
    };
    return origin;
  }
}

ScheduleModel.init(
  {
    userId: Sequelize.INTEGER,
    date: {
      type: Sequelize.DATEONLY,
      get function() {
        return this.getDataValue('date').format('YYYY-MM-DD')
      }
    },
    times: Sequelize.STRING,
    availableTimes: Sequelize.STRING
  },
  merge(
    {
      sequelize,
      tableName: 'schedules',
      modelName: 'schedules',
    },
    InfoCrudMixin.options
  )
)

//Build many to one association between User and Schedule
UserModel.hasMany(ScheduleModel, { onDelete: 'CASCADE' })
ScheduleModel.belongsTo(UserModel)

export { ScheduleModel };
