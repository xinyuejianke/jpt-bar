import { Failed, logger, NotFound } from 'lin-mizar';
import { AppointmentModel } from '../model/appointment'
import { UserDao } from '../dao/user'
import { MemberDao } from '../dao/member'
import { MembershipDao } from '../dao/membership'
import { ScheduleDao } from '../dao/schedule'
import { Op } from 'sequelize';
import sequelize from '../lib/db';
import { UserModel } from '../model/user';
import { MemberModel } from '../model/member';

const memberDao = new MemberDao()
const userDao = new UserDao()
const membershipDao = new MembershipDao()
const scheduleDao = new ScheduleDao()

class AppointmentDao {
  async createAppointment(v) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const appointment = new AppointmentModel()
      appointment.memberId = v.get('body.member_id')
      appointment.userId = v.get('body.employee_id')
      appointment.dateTime = v.get('body.date_time')
      appointment.comment = v.get('body.comment')

      await memberDao.getMember(appointment.memberId)
      await userDao.getEmployee(appointment.userId)
      //check appointment availability for target employee, then update schedule
      await scheduleDao.removeAvailableTime(appointment.userId, appointment.dateTime, transaction)

      await appointment.save({ transaction })
      await transaction.commit();
      //print full info of created appointment
      return await this.getAppointment(appointment.id)
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
        throw new NotFound(error)
      }
    }
  }

  async getAppointment(id) {
    return await AppointmentModel.findOne({
      where: { id },
      include: [{ model: UserModel }, { model: MemberModel }]
    })
  }

  async getHistoricalAppointments(userId) {
    await userDao.getWechatUser(userId)
    const members = await membershipDao.getAllMembers(userId)
    const memberIds = members.map(m => m.id)
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
    logger.debug(`start of today date: ${startOfToday.toDateString()} at time: ${startOfToday.toTimeString()}`)
    const appointments = await AppointmentModel.findAll({
      where: {
        memberId: { [Op.in]: memberIds },
        dateTime: { [Op.lt]: startOfToday }
      },
      include: [{ model: UserModel }, { model: MemberModel }]
    })
    return appointments
  }

  async getProcessingAppointments(userId) {
    await userDao.getWechatUser(userId)
    const members = await membershipDao.getAllMembers(userId)
    const memberIds = members.map(m => m.id)
    const appointments = await AppointmentModel.findAll({
      where: {
        memberId: { [Op.in]: memberIds },
        dateTime: { [Op.gte]: new Date() }
      },
      include: [{ model: UserModel }, { model: MemberModel }]
    })
    return appointments
  }

  async deleteUnexpiredAppointment(v) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const memberId = v.get('body.member_id')
      const userId = v.get('body.employee_id')
      const dateTime = v.get('body.date_time')
      const appointment = await AppointmentModel.findOne({
        where: { memberId, userId, dateTime },
        include: [{ model: UserModel }, { model: MemberModel }]
      })
      await scheduleDao.addAvailableTime(userId, dateTime, transaction)
      if (!appointment) {
        throw new NotFound({ message: `未找到预约信息：用户id：${memberId}，工作人员id：${userId}，预约日期：${dateTime}` })
      }
      await appointment.destroy({ transaction })
      await transaction.commit();
      return appointment
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
        throw new Failed(error)
      }
    }
  }
}

export { AppointmentDao };
