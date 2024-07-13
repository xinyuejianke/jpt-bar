import { LinRouter, disableLoading } from 'lin-mizar';
import { AppointmentValidator } from '../../validator/appointment';
import { PageSystemValidator, PositiveIdValidator } from '../../validator/common';
import { getSafeParamId } from '../../lib/util';
import { adminRequired, groupRequired } from '../../middleware/jwt';
import { AppointmentDao } from '../../dao/appointment';


const appointmentApi = new LinRouter({
  prefix: '/v1/appointments',
  module: 'appointments'
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
  '/:id',
  appointmentApi.permission('查看预约信息'),
  groupRequired,
  async ctx => {
    await new PositiveIdValidator().validate(ctx)
    const appointmentId = getSafeParamId(ctx)
    const appointment = await appointmentDto.getAppointment(appointmentId)
    ctx.json(appointment)
  }
)

appointmentApi.linGet(
  'getAllAppointments',
  '/',
  appointmentApi.permission('查看预约历史'),
  adminRequired,
  async ctx => {
    const appointments = await appointmentDto.getAllAppointments()
    ctx.json(appointments)
  }
)

appointmentApi.linGet(
  'getAllAppointmentsGroupByPage',
  '/results/group/by/page',
  appointmentApi.permission('查看第N页的预约'),
  adminRequired,
  async ctx => {
    const v = await new PageSystemValidator().validate(ctx)
    ctx.json(await appointmentDto.getAppointmentList(
      v.get('query.pageNumber'),
      v.get('query.rowsPerPage'),
      v.get('query.dateTime'),
      v.get('query.userId'),
      v.get('query.memberId'),
    ))
  }
)

appointmentApi.linGet(
  'getHistoricalAppointment',
  '/history/:id',
  appointmentApi.permission('查看预约历史'),
  groupRequired,
  async ctx => {
    await new PositiveIdValidator().validate(ctx)
    const userId = getSafeParamId(ctx)
    const historicalAppointments = await appointmentDto.getHistoricalAppointments(userId)
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
    const userId = getSafeParamId(ctx)
    const processingAppointments = await appointmentDto.getProcessingAppointments(userId)
    ctx.json(processingAppointments)
  }
)

appointmentApi.linDelete(
  'deleteUnexpiredAppointment',
  '/',
  appointmentApi.permission('删除未过期预约'),
  groupRequired,
  async ctx => {
    const v = await new AppointmentValidator().validate(ctx)
    ctx.json(await appointmentDto.deleteUnexpiredAppointment(v))
  }
)

appointmentApi.linDelete(
  'deleteAppointment',
  '/:id',
  appointmentApi.permission('删除预约'),
  adminRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx)
    await appointmentDto.deleteAppointment(v.get('path.id'))
    ctx.success({ message: '成功删除预约' })
  }
)

module.exports = { appointmentApi, [disableLoading]: false };
