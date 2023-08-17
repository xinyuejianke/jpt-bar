import { logger, NotFound } from 'lin-mizar';
import { AppointmentModel } from '../model/appointment'
import { UserDao } from '../dao/user'
import { MemberDao } from '../dao/member'
import { MembershipDao } from '../dao/membership'
import { Op } from 'sequelize';

const memberDao = new MemberDao()
const userDao = new UserDao()
const membershipDao = new MembershipDao()

class AppointmentDao {
  async createAppointment(v) {
    const appointment = new AppointmentModel()
    appointment.memberId = v.get('body.member_id')
    appointment.employeeId = v.get('body.employee_id')
    appointment.dateTime = v.get('body.date_time')
    appointment.comment = v.get('body.comment')

    await memberDao.getMember(appointment.memberId)
    await userDao.getEmployee(appointment.employeeId)
    return await appointment.save()
  }

  async getAppointment(id) {
    return await AppointmentModel.findOne({ where: { id } })
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
    })
    return appointments
  }

  async getProcessingAppointments(memberId) {
    await memberDao.getMember(memberId)
    const appointments = await AppointmentModel.findAll({
      where: {
        memberId,
        dateTime: { [Op.gt]: new Date() }
      },
    })
    return appointments
  }
}

export { AppointmentDao };