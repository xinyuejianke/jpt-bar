import { LinValidator, Rule } from 'lin-mizar';

class MemberValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isOptional'),
      new Rule('isInt', ' must be a positive integer', { min: 1 })
    ]
    this.gender = [
      new Rule('matches', " only allow to use 'm' or 'f'", '^[m|f]{1}$')
    ]
    this.nickname = [
      new Rule('isLength', 'Should between 2 to 32', { min: 2, max: 32 })
    ]
    this.birthday = [
      new Rule('matches', " must follow format 'YYYY-MM-DD'", '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$')
    ]
  }
}

export { MemberValidator };
