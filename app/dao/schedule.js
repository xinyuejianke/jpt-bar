import { NotFound, RepeatException } from 'lin-mizar';
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

  async getScheduleOnDate(v) {
    const userId = v.get('path.user_id')
    await userDto.getEmployee(userId)

    const date = v.get('path.date')
    const schedule = await ScheduleModel.findOne({ where: { userId, date } })
    if (!schedule) {
      throw new NotFound({
        message: `无法找到工作人员id：${userId} 在${date}的排班记录`
      })
    }
    return schedule
  }

}

export { ScheduleDao };
