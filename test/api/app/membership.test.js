import '../../helper/initial';
import request from 'supertest';
import { createApp } from '../../../app/app';
import sequelize from '../../../app/lib/db';
import { getToken, saveTokens } from '../../helper/token';
import { UserIdentityModel, UserModel } from '../../../app/model/user';
import { GroupModel } from '../../../app/model/group';
import { IdentityType } from '../../../app/lib/type';
import { UserGroupModel } from '../../../app/model/user-group';

describe('membership crud', () => {
  let app
  let token

  beforeAll(async done => {
    console.log('start admin');
    // 初始化 app
    app = await createApp()
    await sequelize.sync({ force: true });
    await UserModel.create({ username: 'root', nickname: 'root' });
    await UserIdentityModel.create({
      user_id: 1,
      identity_type: IdentityType.Password,
      identifier: 'root',
      credential: 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'
    });
    await GroupModel.create({ name: 'root', info: '超级用户组', level: 1 });
    await GroupModel.create({ name: 'guest', info: '游客组', level: 2 });
    await UserGroupModel.create({ user_id: 1, group_id: 1 });

    done();
  });

  beforeEach(async done => {
    const login = await request(app.callback())
      .post('/cms/user/login')
      .send({
        username: 'root',
        password: '123456'
      });
    saveTokens(login.body);
    token = getToken();
    done();
  });

  afterAll(async done => {
    setTimeout(async () => {
      await sequelize.close();
      done();
    }, 500);
  });

  it('create a new member', async () => {
    const response = await request(app.callback())
      .post('/v1/member/')
      .auth(token, { type: 'bearer' })
      .send({
        nickname: '豆豆',
        gender: "m",
        birthday: '2020-01-01'
      });
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });
})
