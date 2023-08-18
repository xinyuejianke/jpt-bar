import { RepeatException, ParametersException, NotFound, Forbidden } from 'lin-mizar';
import { UserDao } from '../dao/user'
import { ScheduleModel } from '../model/schedule'

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
    schedule.times = v.get('body.times')
    schedule.availableTimes = v.get('body.times')
    return await schedule.save()
  }

  async getEmployeeScheduleOnDate(v) {
    const userId = v.get('path.user_id')
    await userDto.getEmployee(userId)

    const date = v.get('path.date')
    return await ScheduleModel.findOne({ where: { userId, date } })
  }

  async getAllSchedulesOnDate(date) {
    return await ScheduleModel.findAll({ where: { date } })
  }

  async updateSchedule(userId, dateTime) {
    if (!dateTime instanceof Date) {
      throw new ParametersException({ message: `${dateTime} 必须是 Date 类型` })
    }
    const year = dateTime.getFullYear()
    const month = String(dateTime.getMonth() + 1).padStart(2, '0')
    const day = String(dateTime.getDate()).padStart(2, '0')
    const date = `${year}-${month}-${day}`

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
    return await schedule.save()
  }
}

export { ScheduleDao };
