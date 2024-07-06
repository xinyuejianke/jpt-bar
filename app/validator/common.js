import { LinValidator, Rule, config } from 'lin-mizar';

const DATE_RULE = new Rule('matches', "date must follow format 'YYYY-MM-DD'", '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$')

class PositiveIdValidator extends LinValidator {
  constructor() {
    super();
    this.id = new Rule('isInt', 'id必须为正整数', { min: 1 });
  }
}

class PaginateValidator extends LinValidator {
  constructor() {
    super();
    this.count = [
      new Rule('isOptional', '', config.getItem('countDefault')),
      new Rule('isInt', 'count必须为正整数', { min: 1 })
    ];
    this.page = [
      new Rule('isOptional', '', config.getItem('pageDefault')),
      new Rule('isInt', 'page必须为整数，且大于等于0', { min: 0 })
    ];
  }
}

class PageSystemValidator extends LinValidator {
  constructor() {
    super()
    this.pageNumber = [
      new Rule('isInt', 'pageNumber 必须为整数，且大于等于0', { min: 0 })
    ];
    this.rowsPerPage = [
      new Rule('isInt', 'rowsPerPage 必须为整数，且大于等于1', { min: 1 })
    ];
    this.userId = [
      new Rule('isOptional', '', config.getItem('pageDefault')),
      new Rule('isInt', 'rowsPerPage 必须为整数，且大于等于1', { min: 1 })
    ]
    this.date = [
      new Rule('isOptional'),
      DATE_RULE
    ]
  }
}

export { PaginateValidator, PositiveIdValidator, PageSystemValidator };
