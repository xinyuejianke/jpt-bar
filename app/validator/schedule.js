import { LinValidator, Rule } from 'lin-mizar';

const USER_ID_RULE = new Rule('isInt', 'user_id must be a positive integer', { min: 1 })
const DATE_RULE = new Rule('matches', "date must follow format 'YYYY-MM-DD'", '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$')

class ScheduleValidator extends LinValidator {
  constructor() {
    super()
    this.user_id = [USER_ID_RULE]
    this.date = [DATE_RULE]
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
    this.date = [DATE_RULE]
  }
}

class DateValidator extends LinValidator {
  constructor() {
    super()
    this.date = [DATE_RULE]
  }
}

class DaysValidator extends LinValidator {
  constructor() {
    super()
    this.days = new Rule('isInt', 'user_id must be a positive integer', { min: 0 })
  }
}

export { ScheduleValidator, SchedulePathValidator, DateValidator, DaysValidator }
