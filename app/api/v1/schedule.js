import { LinRouter, disableLoading } from 'lin-mizar';
import { groupRequired } from '../../middleware/jwt';
import { ScheduleValidator, SchedulePathValidator, DateValidator, DaysValidator } from '../../validator/schedule';
import { ScheduleDao } from '../../dao/schedule';


const scheduleApi = new LinRouter({
  prefix: '/v1/schedules',
  module: 'schedules'
})

const scheduleDto = new ScheduleDao();

scheduleApi.linPost(
  'createSchedule',
  '/',
  scheduleApi.permission('新增排班表'),
  groupRequired,
  async ctx => {
    const v = await new ScheduleValidator().validate(ctx)
    ctx.json(await scheduleDto.createSchedule(v))
  }
)

scheduleApi.linGet(
  'getEmployeeScheduleOnDate',
  '/:user_id/:date',
  scheduleApi.permission('检索排班表'),
  groupRequired,
  async ctx => {
    const v = await new SchedulePathValidator().validate(ctx)
    ctx.json(await scheduleDto.getEmployeeScheduleOnDate(v))
  }
)

scheduleApi.linPut(
  'updateEmployeeScheduleOnDate',
  '/',
  scheduleApi.permission('更新排班表'),
  groupRequired,
  async ctx => {
    const v = await new ScheduleValidator().validate(ctx)
    ctx.json(await scheduleDto.updateEmployeeScheduleOnDate(v))
  }
)

scheduleApi.linGet(
  'getAllSchedulesOnDate',
  '/:date',
  scheduleApi.permission('查看当日所有排班'),
  groupRequired,
  async ctx => {
    const v = await new DateValidator().validate(ctx)
    ctx.json(await scheduleDto.getAllSchedulesOnDate(v.get('path.date')))
  }
)

scheduleApi.linGet(
  'getAllSchedules',
  '/',
  scheduleApi.permission('查看所有排班'),
  groupRequired,
  async ctx => {
    ctx.json(await scheduleDto.getAllSchedules())
  }
)

scheduleApi.linDelete(
  'deleteSchedule',
  '/:user_id/:date',
  scheduleApi.permission('删除排班表'),
  groupRequired,
  async ctx => {
    const v = await new SchedulePathValidator().validate(ctx)
    ctx.json(await scheduleDto.deleteEmployeeScheduleOnDate(v))
  }
)

scheduleApi.linGet(
  'getAllSchedulesNextNDays',
  '/next/:days/days',
  scheduleApi.permission('查看未来N天的所有排班'),
  groupRequired,
  async ctx => {
    const v = await new DaysValidator().validate(ctx)
    ctx.json(await scheduleDto.getAllSchedulesNextNDays(v.get('path.days')))
  }
)

module.exports = { scheduleApi, [disableLoading]: false };
