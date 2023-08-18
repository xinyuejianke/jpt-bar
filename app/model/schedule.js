import { Sequelize, Model } from 'sequelize'
import sequelize from '../lib/db';
import { merge } from 'lodash';
import { InfoCrudMixin } from 'lin-mizar';

class ScheduleModel extends Model {

  toJSON() {
    const origin = {
      userId: this.userId,
      date: this.date,
      times: this.times,
      availableTimes: this.availableTimes
    };
    return origin;
  }
}

ScheduleModel.init(
  {
    userId: Sequelize.STRING,
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
      collate: 'utf8mb4_general_ci'
    },
    InfoCrudMixin.options
  )
)

export { ScheduleModel };
