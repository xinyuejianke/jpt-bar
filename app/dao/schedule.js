import { RepeatException, ParametersException, NotFound, Failed, logger } from 'lin-mizar';
import { Op } from 'sequelize';
import { UserDao } from '../dao/user'
import { ScheduleModel } from '../model/schedule'
import { UserModel } from '../model/user';

const userDto = new UserDao()

class ScheduleDao {

  async createSchedule(v) {
    const userId = v.get('body.user_id')
    await userDto.getEmployee(userId)

    const date = v.get('body.date')
    const hasSchedule = await ScheduleModel.findOne({ where: { userId, date } })
    if (hasSchedule) {
      throw new RepeatException({
        message: `工作人员id：${userId}已经在${date}排班，请更新或删除已存在的排班再新增排班`
      })
    }
    const schedule = new ScheduleModel()
    schedule.userId = userId
    schedule.date = date
    schedule.times = v.get('body.times').split(',').sort().toString()
    schedule.availableTimes = v.get('body.times')
    await schedule.save()
    return this.getSchedule(schedule.id)
  }

  async getSchedule(id) {
    return await ScheduleModel.findOne({ where: { id }, include: UserModel })
  }

  async getAllSchedulesNextNDays(days) {
    let dates = []
    const today = new Date()
    for (let i = 0; i < days; i++) {
      let date = new Date()
      date.setDate(today.getDate() + i)
      const formattedDate = this.getFormattedDate(date)
      dates.push(formattedDate)
    }
    logger.debug(`target dates: ${dates}`)
    const schedules = await ScheduleModel.findAll({
      where: { date: { [Op.in]: dates } },
      include: UserModel
    })
    return schedules
  }

  async updateEmployeeScheduleOnDate(v) {
    const userId = v.get('body.user_id')
    await userDto.getEmployee(userId)

    const date = v.get('body.date')
    const schedule = await ScheduleModel.findOne({ where: { userId, date }, include: UserModel })
    if (!schedule) {
      throw new NotFound({ message: `更新失败：工作人员id：${userId}没有在${date}排班` })
    }
    if (schedule.times !== schedule.availableTimes) {
      throw new Failed({ message: `设定预约时间与可预约时间不一致，请检查工作人员 id：${userId}在${date}是否已经有预约` })
    }
    const times = v.get('body.times')
    schedule.times = times
    schedule.availableTimes = times
    return await schedule.save()
  }

  async updateEmployeeSchedule(v) {
    const scheduleId = v.get('path.id')
    const schedule = await ScheduleModel.findOne({ where: { id: scheduleId }, include: UserModel })

    if (!schedule) {
      throw new NotFound({ message: `更新失败：没有找到id：${id} 的排班` })
    }
    if (schedule.times !== schedule.availableTimes) {
      throw new Failed({ message: `设定预约时间与可预约时间不一致，请检查工作人员 id：${schedule.user.id}在${schedule.date}是否已经有预约` })
    }
    const times = v.get('body.times')
    schedule.times = times
    schedule.availableTimes = times
    return await schedule.save()
  }

  async deleteEmployeeScheduleOnDate(v) {
    const userId = v.get('path.user_id')
    await userDto.getEmployee(userId)

    const date = v.get('path.date')
    const schedule = await ScheduleModel.findOne({ where: { userId, date }, include: UserModel })
    if (!schedule) {
      throw new Failed({ message: `删除失败：工作人员id：${userId}没有在${date}排班` })
    }
    if (schedule.times !== schedule.availableTimes) {
      throw new Failed({ message: `设定预约时间与可预约时间不一致，请检查工作人员 id：${userId}在${date}是否已经有预约` })
    }
    return await schedule.destroy()
  }

  async deleteSchedule(id) {
    const schedule = await ScheduleModel.findOne({ where: { id }, include: UserModel })
    if (!schedule) {
      throw new NotFound({ message: `ID 为 ${id} 的排班记录不存在` })
    }
    if (schedule.times !== schedule.availableTimes) {
      throw new Failed({ message: `设定预约时间与可预约时间不一致，请检查工作人员 id：${schedule.user.id}在${schedule.date}是否已经有预约` })
    }
    return await schedule.destroy()
  }

  async getEmployeeScheduleOnDate(v) {
    const userId = v.get('path.user_id')
    await userDto.getEmployee(userId)

    const date = v.get('path.date')
    return await ScheduleModel.findOne({ where: { userId, date }, include: UserModel })
  }

  async getAllSchedulesOnDate(date) {
    return await ScheduleModel.findAll({
      where: { date },
      include: { model: UserModel }
    })
  }

  async getAllSchedules() {
    return await ScheduleModel.findAll({
      include: { model: UserModel },
      order: [['date', 'DESC']]
    })
  }

  async removeAvailableTime(userId, dateTime, transaction) {
    this.isDateType(dateTime)
    const date = this.getFormattedDate(dateTime)

    const schedule = await ScheduleModel.findOne({ where: { userId, date } })
    if (!schedule) {
      throw new NotFound({ message: `找不到工作人员id：${userId} 在 ${date} 的排班记录` })
    }

    const time = dateTime.toTimeString().split(' ')[0].substring(0, 5)
    const availableTimes = schedule.availableTimes.split(',')
    const isAvailable = availableTimes.indexOf(time)
    if (isAvailable === -1) {
      throw new NotFound({ message: `在availableTimes 中找不到 ${time} 时间(该时间可能已被预约)` })
    }
    availableTimes.splice(isAvailable, 1) //rm target time in schedule.availableTimes
    schedule.availableTimes = availableTimes.toString()
    return await schedule.save({ transaction })
  }

  async addAvailableTime(userId, dateTime, transaction) {
    this.isDateType(dateTime)
    const formattedDateTime = this.getFormattedDateTime(new Date(dateTime))
    const date = formattedDateTime.date
    const time = formattedDateTime.time

    const schedule = await ScheduleModel.findOne({ where: { userId, date } })
    if (!schedule) {
      throw new NotFound({ message: `找不到工作人员id：${userId} 在 ${date} 的排班记录` })
    }
    //avoid split empty string ('') become array ['']
    const availableTimes = schedule.availableTimes === '' ? [] : schedule.availableTimes.split(',')
    const isAvailable = availableTimes.indexOf(time)
    if (isAvailable !== -1) {
      throw new Failed({ message: `在availableTimes 已存在 ${time} 时间)` })
    }
    availableTimes.push(time)
    schedule.availableTimes = availableTimes.sort().toString()
    return await schedule.save({ transaction })
  }

  getFormattedDate(date) {
    this.isDateType(date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  getFormattedDateTime(dateTime) {
    this.isDateType(dateTime)
    const date = this.getFormattedDate(dateTime)
    const time = dateTime.toTimeString().split(' ')[0].substring(0, 5)
    return { date, time, dateTime: `${date} ${time}` }
  }

  isDateType(date) {
    if (!date instanceof Date) {
      throw new ParametersException({ message: `${date} 必须是 Date 类型` })
    }
    return true
  }

}

export { ScheduleDao };
