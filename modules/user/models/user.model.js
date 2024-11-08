// `id`, `name`, `email`, `avatar`, `created_at`, `updated_at`
const knex = require("#app/database/knex");

/**
 * @class Administrator
 *
 */
class User {
  /**
   * Obtiene todos los administradores
   * @returns
   */
  static async All() {
    return await knex("users").select("*");
  }

  /**
   * Obtiene un administrador por su email
   * @param _email: string
   * @returns
   */
  static async FindByEmail(_email) {
    return await knex("users").where("email", _email).first();
  }

  /**
   * Obtiene un administrador por su id
   * @param {*} _id
   * @returns
   */
  static async FindById(_id) {
    return await knex("users").where("id", _id).first();
  }

  /**
   * Crea un nuevo administrador
   * @param {name: string, email: string } data
   * @returns
   */
  static async Create(data) {
    data.created_at = new Date();
    data.updated_at = new Date();
    return await knex("users").insert(data);
  }

  /**
   * Actualiza un administrador
   * @param _id: number
   * @param {id: number, name: string, email: string } data
   * @returns
   */
  static async Update(_id, data) {
    data.updated_at = new Date();
    return await knex("users").where("id", _id).update(data);
  }

  /**
   * Elimina un administrador
   * @param _id: number
   * @returns
   */
  static async Delete(_id) {
    return await knex("users").where("id", _id).delete();
  }

  /**
   * DataTable
   */
  static async DataTable(queryData) {
    const { draw, start, length, search, order, columns } = queryData;
    const { value: searchValue } = search;
    const { column, dir } = order[0];
    const { data } = columns[column];

    const users = await knex("users")
      .select("id")
      .select("avatar")
      .select("name")
      .select("email")
      .select("created_at")
      .select("updated_at")
      .where("name", "like", `%${searchValue}%`)
      .orWhere("email", "like", `%${searchValue}%`)
      .orderBy(data, dir)
      .limit(length)
      .offset(start);

    const total = await knex("users").count("* as total").first();
    const filtered = await knex("users")
      .where("name", "like", `%${searchValue}%`)
      .orWhere("email", "like", `%${searchValue}%`)
      .count("* as total")
      .first();

    return {
      draw,
      recordsTotal: total.total,
      recordsFiltered: filtered.total,
      data: users,
    };
  }
}

module.exports = {
  User
};
