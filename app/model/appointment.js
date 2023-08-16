import { Sequelize, Model } from 'sequelize'
import sequelize from '../lib/db';
import { merge } from 'lodash';
import { InfoCrudMixin } from 'lin-mizar';

class AppointmentModel extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      employeeId: this.employeeId,
      memberId: this.memberId,
      dateTime: this.dateTime,
      comment: this.comment,
      advice: this.advice
    };
    return origin;
  }
}

AppointmentModel.init(
  {
    memberId: Sequelize.INTEGER,
    employeeId: Sequelize.INTEGER,
    dateTime: {
      type: Sequelize.DATE,
      get function() {
        return this.getDataValue('dateTime').format('YYYY-MM-DD HH:mm')
      }
    },
    comment: Sequelize.STRING(255),
    advice: Sequelize.STRING(255)
  },
  merge(
    {
      sequelize,
      tableName: 'appointment',
      modelName: 'appointment',
      collate: 'utf8mb4_general_ci'
    },
    InfoCrudMixin.options
  )
)

export { AppointmentModel };
