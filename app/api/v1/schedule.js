import { LinRouter, disableLoading } from 'lin-mizar';
import { MemberValidator } from '../../validator/member';
import { MemberDao } from '../../dao/member';
import { PositiveIdValidator } from '../../validator/common';
import { getSafeParamId } from '../../lib/util';
import { groupRequired } from '../../middleware/jwt';
import { ScheduleValidator, SchedulePathValidator } from '../../validator/schedule';
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
  'getScheduleOnDate',
  '/:user_id/:date',
  scheduleApi.permission('检索排班表'),
  groupRequired,
  async ctx => {
    const v = await new SchedulePathValidator().validate(ctx)
    ctx.json(await scheduleDto.getScheduleOnDate(v))
  }
)

module.exports = { scheduleApi, [disableLoading]: false };
