// `id`, `name`, `email`, `created_at`, `updated_at`
const knex = require("#app/database/knex");
const { da } = require("date-fns/locale");

/**
 * @class Administrator
 *
 */
class Assistant {
  /**
   * Obtiene todos los administradores
   * @returns
   */
  static async All() {
    return await knex("assistants").select("*");
  }

  /**
   * Obtiene un administrador por su email
   * @param _email: string
   * @returns
   */
  static async FindByEmail(_email) {
    return await knex("assistants").where("email", _email).first();
  }

  /**
   * Obtiene un administrador por su id
   * @param {*} _id
   * @returns
   */
  static async FindById(_id) {
    return await knex("assistants").where("id", _id).first();
  }

  /**
   * Crea un nuevo administrador
   * @param {name: string, email: string } data
   * @returns
   */
  static async Create(data) {
    data.created_at = new Date();
    data.updated_at = new Date();
    return await knex("assistants").insert(data);
  }

  /**
   * Actualiza un administrador
   * @param _id: number
   * @param {id: number, name: string, email: string } data
   * @returns
   */
  static async Update(_id, data) {
    data.updated_at = new Date();
    return await knex("assistants").where("id", _id).update(data);
  }

  /**
   * Elimina un administrador
   * @param _id: number
   * @returns
   */
  static async Delete(_id) {
    return await knex("assistants").where("id", _id).delete();
  }

  /**
   * DataTable
   */
  static async DataTable(queryData) {
    const { draw, start, length, search, order, columns } = queryData;
    const { value: searchValue } = search;
    const { column, dir } = order[0];
    const { data } = columns[column];

    const assistants = await knex("assistants")
      .select("id")
      .select("name")
      .select("email")
      .select("created_at")
      .select("updated_at")
      .where("name", "like", `%${searchValue}%`)
      .orWhere("email", "like", `%${searchValue}%`)
      .orderBy(data, dir)
      .limit(length)
      .offset(start);

    const total = await knex("assistants").count("* as total").first();
    const filtered = await knex("assistants")
      .where("name", "like", `%${searchValue}%`)
      .orWhere("email", "like", `%${searchValue}%`)
      .count("* as total")
      .first();

    return {
      draw,
      recordsTotal: total.total,
      recordsFiltered: filtered.total,
      data: assistants,
    };
  }
}

module.exports = {
  Assistant,
};
