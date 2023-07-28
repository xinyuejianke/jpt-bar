import { LinValidator, Rule } from 'lin-mizar';

class MembershipValidator extends LinValidator {
  constructor() {
    super()
    this.user_id = [
      new Rule('isInt', ' must be a positive integer', { min: 1 })
    ]
    this.member_id = [
      new Rule('isInt', ' must be a positive integer', { min: 1 })
    ]
  }
}

export { MembershipValidator };
