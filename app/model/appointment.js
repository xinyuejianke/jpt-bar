import { Sequelize, Model } from 'sequelize'
import sequelize from '../lib/db';
import { merge } from 'lodash';
import { InfoCrudMixin } from 'lin-mizar';
import { UserModel } from './user';
import { MemberModel } from './member';

class AppointmentModel extends Model {

  getDateTimeByChinaTimezone(dateTime) {
    return new Date(dateTime.setMinutes(dateTime.getMinutes() - dateTime.getTimezoneOffset()))
  }

  toJSON() {
    const origin = {
      id: this.id,
      member: this.member,
      employee: this.user,
      dateTime: this.getDateTimeByChinaTimezone(this.dateTime),
      comment: this.comment,
      advice: this.advice
    };
    return origin;
  }
}

AppointmentModel.init(
  {
    userId: Sequelize.INTEGER,
    memberId: Sequelize.INTEGER,
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
      tableName: 'appointments',
      modelName: 'appointments'
    },
    InfoCrudMixin.options
  )
)

//Build many to one association between User and Appointment
UserModel.hasMany(AppointmentModel, { onDelete: 'CASCADE' })
AppointmentModel.belongsTo(UserModel)

//Build many to one association between Member and Appointment
MemberModel.hasMany(AppointmentModel, { onDelete: 'CASCADE' })
AppointmentModel.belongsTo(MemberModel)

export { AppointmentModel };
