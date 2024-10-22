    // `id`    `name`    `email`    `avatar`    `password`
const knex = require('#app/database/knex');

/**
 * @class Administrator
 * 
 */
class Administrator {

  /**
   * Obtiene todos los administradores
   * @returns 
   */
  static async All() {
    return await knex('administrators').select('*');
  }

  /**
   * Obtiene un administrador por su email
   * @param _email: string 
   * @returns 
   */
  static async FindByEmail(_email) {
    return await knex('administrators').where('email', _email).first();
  }

  /**
   * Obtiene un administrador por su id
   * @param {*} _id 
   * @returns 
   */
  static async FindById(_id) {
    return await knex('administrators').where('id', _id).first();
  }

  /**
   * Crea un nuevo administrador
   * @param {name: string, email: string, avatar: string, password: string } data 
   * @returns 
   */
  static async Create(data) {
    return await knex('administrators').insert(data);
  }

  /**
   * Actualiza un administrador
   * @param _id: number
   * @param {id: number, name: string, email: string, avatar: string, password: string } data 
   * @returns 
   */
  static async Update(_id, data) {
    return await knex('administrators').where('id', _id).update(data);
  }

  /**
   * Elimina un administrador
   * @param _id: number 
   * @returns 
   */
  static async Delete(_id) {
    return await knex('administrators').where('id', _id).delete();
  }

  /**
   * DataTable
   */
  static async DataTable(queryData) {
    const { draw, start, length, search, order, columns } = queryData;
    const { value: searchValue } = search;
    const { column, dir } = order[0];
    const { data } = columns[column];

    const administrators = await knex('administrators')
      .select('id').select('name').select('email').select('avatar')
      .where('name', 'like', `%${searchValue}%`)
      .orWhere('email', 'like', `%${searchValue}%`)
      .orderBy(data, dir)
      .limit(length)
      .offset(start);

    const total = await knex('administrators').count('* as total').first();
    const filtered = await knex('administrators')
      .where('name', 'like', `%${searchValue}%`)
      .orWhere('email', 'like', `%${searchValue}%`)
      .count('* as total')
      .first();

    return {
      draw,
      recordsTotal: total.total,
      recordsFiltered: filtered.total,
      data: administrators
    };
  }

}

module.exports = {
  Administrator
}