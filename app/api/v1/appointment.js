import { LinRouter, disableLoading } from 'lin-mizar';
import { AppointmentValidator } from '../../validator/appointment';
import { PositiveIdValidator } from '../../validator/common';
import { getSafeParamId } from '../../lib/util';
import { groupRequired } from '../../middleware/jwt';
import { AppointmentDao } from '../../dao/appointment';


const appointmentApi = new LinRouter({
  prefix: '/v1/appointment',
  module: 'appointment'
})

const appointmentDto = new AppointmentDao()

appointmentApi.linPost(
  'createAppointment',
  '/',
  appointmentApi.permission('预约'),
  groupRequired,
  async ctx => {
    const v = await new AppointmentValidator().validate(ctx)
    ctx.json(await appointmentDto.createAppointment(v))
  }
)

appointmentApi.linGet(
  'getAppointment',
  ':id',
  appointmentApi.permission('查看预约信息'),
  groupRequired,
  async ctx => {
    await new PositiveIdValidator().validate(ctx)
    const id = getSafeParamId(ctx)
    const appointment = await appointmentDto.getAppointment(id)
    ctx.json(appointment)
  }
)

appointmentApi.linGet(
  'getHistoricalAppointment',
  '/history/:id',
  appointmentApi.permission('查看预约历史'),
  groupRequired,
  async ctx => {
    await new PositiveIdValidator().validate(ctx)
    const id = getSafeParamId(ctx)
    const historicalAppointments = await appointmentDto.getHistoricalAppointments(id)
    ctx.json(historicalAppointments)
  }
)

appointmentApi.linGet(
  'getProcessingAppointment',
  '/processing/:id',
  appointmentApi.permission('查看进行中预约'),
  groupRequired,
  async ctx => {
    await new PositiveIdValidator().validate(ctx)
    const id = getSafeParamId(ctx)
    const processingAppointments = await appointmentDto.getProcessingAppointments(id)
    ctx.json(processingAppointments)
  }
)

module.exports = { appointmentApi, [disableLoading]: false };