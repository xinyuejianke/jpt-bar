import { LinValidator, Rule } from 'lin-mizar';

class ScheduleValidator extends LinValidator {
  constructor() {
    super()
    this.user_id = [
      new Rule('isInt', 'user_id must be a positive integer', { min: 1 })
    ]
    this.date = [
      new Rule('matches', "date must follow format 'YYYY-MM-DD'", '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$')
    ]
    this.times = [
      new Rule('isLength', 'times length must at least 5', { min: 5 }),
      new Rule('matches', 'times must follow 24 time format with COMMA(,) separator (e.g. 13:00,13:30,14:00)', '^((([01]?[0-9]|2[0-3]):[0-5][0-9])(,{0,1}))*$')
    ]
  }
}

class SchedulePathValidator extends LinValidator {
  constructor() {
    super()
    this.user_id = [
      new Rule('isInt', ' must be a positive integer', { min: 1 })
    ]
    this.date = [
      new Rule('matches', " must follow format 'YYYY-MM-DD HH:mm'", '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$')
    ]
  }
}

export { ScheduleValidator, SchedulePathValidator }
