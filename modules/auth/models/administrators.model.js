// `id`    `name`    `email`    `avatar`    `password`
const knex = require("#app/database/knex");

/**
 * @class Administrator
 *
 */
class Administrator {
  
  static table = 'administrators';

  static FindOne(id)
  {
    return knex(this.table).where('id', id).first();
  }

  static async findByEmail(email)
  {
    return knex(this.table).where('email', email).first();
  }

  static async Create(data)
  {
    return knex(this.table).insert(data);
  }

}

module.exports = {
  Administrator
};
