import { LinValidator, Rule } from 'lin-mizar';

class AppointmentValidator extends LinValidator {
  constructor() {
    super();
    this.member_id = new Rule('isInt', ' must be a positive integer', { min: 1 })
    this.employee_id = new Rule('isInt', ' must be a positive integer', { min: 1 })
    this.date_time = new Rule('matches', " must follow format 'YYYY-MM-DD HH:mm'", '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30))) (([0]?[0-5][0-9]|[0-9]):([0-5][0-9]))$')
    this.comment = [
      new Rule('isOptional'),
      new Rule('isLength', ' must shorter than 255 char', { max: 255 })
    ]
  }
}

export { AppointmentValidator };
