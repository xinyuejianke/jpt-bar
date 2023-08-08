const MountType = {
  Mount: 1, // 挂载
  Unmount: 0
};

const IdentityType = {
  Password: 'USERNAME_PASSWORD',
  Wechat: 'WECHAT'
};

const GroupLevel = {
  Root: 1,
  Guest: 2,
  User: 3
};

export { MountType, IdentityType, GroupLevel };
