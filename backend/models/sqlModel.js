import { randomBytes } from 'node:crypto'
import { getPool } from '../config/mysql.js'

const columnNames = {
  _id: 'id',
  id: 'id',
  userId: 'userId',
  docId: 'docId',
  slotDate: 'slotDate',
  slotTime: 'slotTime',
  userData: 'userData',
  docData: 'docData',
  paymentMethod: 'paymentMethod',
  paymentDate: 'paymentDate',
  paymentReference: 'paymentReference',
  isCompleted: 'isCompleted',
  slots_booked: 'slots_booked',
  available: 'available',
  address: 'address',
  image: 'image',
  name: 'name',
  email: 'email',
  password: 'password',
  phone: 'phone',
  gender: 'gender',
  dob: 'dob',
  speciality: 'speciality',
  degree: 'degree',
  experience: 'experience',
  about: 'about',
  fees: 'fees',
  date: 'date',
  amount: 'amount',
  cancelled: 'cancelled',
  payment: 'payment'
}
const jsonFields = new Set(['address', 'slots_booked', 'userData', 'docData'])
const booleanFields = new Set(['available', 'cancelled', 'payment', 'isCompleted'])
const numericFields = new Set(['fees', 'amount', 'date', 'paymentDate'])

const encode = (field, value) => jsonFields.has(field) ? JSON.stringify(value ?? {}) : value
const decode = (row, fields) => {
  const record = { _id: row.id }
  for (const field of fields) {
    let value = row[columnNames[field]]
    if (jsonFields.has(field) && typeof value === 'string') value = JSON.parse(value)
    if (booleanFields.has(field)) value = Boolean(value)
    if (numericFields.has(field) && value !== null) value = Number(value)
    record[field] = value
  }
  return record
}

const flattenUpdate = (data, out = {}) => {
  for (const [key, value] of Object.entries(data || {})) {
    if (key === '$set') flattenUpdate(value, out)
    else if (key.includes('.')) {
      const [root, child] = key.split('.', 2)
      out[root] = { ...(out[root] || {}), [child]: value }
    } else out[key] = value
  }
  return out
}

const sqlWhere = (filter, fields) => {
  const clauses = []
  const values = []
  for (const [field, value] of Object.entries(filter || {})) {
    const column = columnNames[field]
    if (!column || !fields.includes(field) && field !== '_id') throw new Error(`Unsupported database filter: ${field}`)
    clauses.push(`\`${column}\` = ?`)
    values.push(value)
  }
  return { clause: clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '', values }
}

class SqlQuery {
  constructor(model, filter, one = false) {
    this.model = model
    this.filter = filter
    this.one = one
    this.excluded = new Set()
  }

  select(selection) {
    const fields = Array.isArray(selection) ? selection : [selection]
    for (const field of fields) if (field.startsWith('-')) this.excluded.add(field.slice(1))
    return this
  }

  async execute() {
    const { clause, values } = sqlWhere(this.filter, this.model.fields)
    const orderColumn = this.model.orderColumn || 'created_at'
    const [rows] = await getPool().execute(`SELECT * FROM \`${this.model.table}\`${clause} ORDER BY \`${orderColumn}\` ASC`, values)
    const records = rows.map(row => {
      const data = decode(row, this.model.fields.filter(field => !this.excluded.has(field)))
      return new this.model(data, false)
    })
    return this.one ? records[0] || null : records
  }

  then(resolve, reject) { return this.execute().then(resolve, reject) }
  catch(reject) { return this.execute().catch(reject) }
}

class SqlModel {
  constructor(data = {}, isNew = true) {
    this._id = data._id || data.id || randomBytes(12).toString('hex')
    for (const field of this.constructor.fields) {
      if (field !== '_id' && Object.hasOwn(data, field)) this[field] = data[field]
    }
    this._isNew = isNew
  }

  toObject() {
    return Object.fromEntries(Object.keys(this).filter(key => key !== '_isNew').map(key => [key, this[key]]))
  }

  toJSON() { return this.toObject() }
  markModified() {}

  async save() {
    const fields = this.constructor.fields.filter(field => field !== '_id' && this[field] !== undefined)
    const columns = ['id', ...fields.map(field => columnNames[field])]
    const values = [this._id, ...fields.map(field => encode(field, this[field]))]
    if (this._isNew) {
      await getPool().execute(
        `INSERT INTO \`${this.constructor.table}\` (${columns.map(column => `\`${column}\``).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
        values
      )
      this._isNew = false
    } else {
      const setters = fields.map(field => `\`${columnNames[field]}\` = ?`).join(', ')
      await getPool().execute(`UPDATE \`${this.constructor.table}\` SET ${setters} WHERE id = ?`, [...values.slice(1), this._id])
    }
    return this
  }

  static find(filter = {}) { return new SqlQuery(this, filter) }
  static findOne(filter = {}) { return new SqlQuery(this, filter, true) }
  static findById(id) { return new SqlQuery(this, { _id: id }, true) }

  static async deleteMany(filter = {}) {
    const { clause, values } = sqlWhere(filter, this.fields)
    return getPool().execute(`DELETE FROM \`${this.table}\`${clause}`, values)
  }

  static async deleteOne(filter = {}) {
    const record = await new SqlQuery(this, filter, true).execute()
    if (!record) return { deletedCount: 0 }
    await getPool().execute(`DELETE FROM \`${this.table}\` WHERE id = ?`, [record._id])
    return { deletedCount: 1 }
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    return this.updateOne({ _id: id }, update, options)
  }

  static async findOneAndUpdate(filter, update) {
    return this.updateOne(filter, update, { new: true })
  }

  static async updateOne(filter, update, options = {}) {
    const existing = await new SqlQuery(this, filter, true).execute()
    if (!existing) return null
    const changes = flattenUpdate(update)
    for (const [field, value] of Object.entries(changes)) {
      if (!this.fields.includes(field) || field === '_id') continue
      if (jsonFields.has(field) && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        existing[field] = { ...(existing[field] || {}), ...value }
      } else existing[field] = value
    }
    const fields = Object.keys(changes).filter(field => this.fields.includes(field) && field !== '_id')
    if (fields.length === 0) return options.new ? existing : null
    const { clause, values: whereValues } = sqlWhere(filter, this.fields)
    const setValues = fields.map(field => encode(field, existing[field]))
    const [result] = await getPool().execute(
      `UPDATE \`${this.table}\` SET ${fields.map(field => `\`${columnNames[field]}\` = ?`).join(', ')}${clause}`,
      [...setValues, ...whereValues]
    )
    if (result.affectedRows === 0) return null
    return options.new ? new SqlQuery(this, { _id: existing._id }, true).execute() : null
  }
}

export default SqlModel
