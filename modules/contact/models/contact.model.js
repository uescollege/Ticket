// `id`, `name`, `email`, `message`, `created_at`
const knex = require("#app/database/knex");

/**
 * @class Contact
 *
 */
class Contact {
  /**
   * Obtiene todos los contacts
   * @returns
   */
  static async All() {
    return await knex("contacts").select("*");
  }

  /**
   * Obtiene un contact por su email
   * @param _email: string
   * @returns
   */
  static async FindByEmail(_email) {
    return await knex("contacts").where("email", _email).first();
  }

  /**
   * Obtiene un contact por su id
   * @param {*} _id
   * @returns
   */
  static async FindById(_id) {
    return await knex("contacts").where("id", _id).first();
  }

  /**
   * Crea un nuevo contact
   * @param {name: string, email: string } data
   * @returns
   */
  static async Create(data) {
    data.created_at = new Date();
    return await knex("contacts").insert(data);
  }

  /**
   * Actualiza un contact
   * @param _id: number
   * @param {id: number, name: string, email: string } data
   * @returns
   */
  static async Update(_id, data) {
    data.updated_at = new Date();
    return await knex("contacts").where("id", _id).update(data);
  }

  /**
   * Elimina un contact
   * @param _id: number
   * @returns
   */
  static async Delete(_id) {
    return await knex("contacts").where("id", _id).delete();
  }

  /**
   * DataTable
   */
  static async DataTable(queryData) {
    const { draw, start, length, search, order, columns } = queryData;
    const { value: searchValue } = search;
    const { column, dir } = order[0];
    const { data } = columns[column];

    const contacts = await knex("contacts")
      .select("id")
      .select("name")
      .select("email")
      .select("created_at")
      .where("name", "like", `%${searchValue}%`)
      .orWhere("email", "like", `%${searchValue}%`)
      .orderBy(data, dir)
      .limit(length)
      .offset(start);

    const total = await knex("contacts").count("* as total").first();
    const filtered = await knex("contacts")
      .where("name", "like", `%${searchValue}%`)
      .orWhere("email", "like", `%${searchValue}%`)
      .count("* as total")
      .first();

    return {
      draw,
      recordsTotal: total.total,
      recordsFiltered: filtered.total,
      data: contacts,
    };
  }
}

module.exports = {
  Contact
};
