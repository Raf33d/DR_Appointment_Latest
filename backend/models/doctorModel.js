import SqlModel from './sqlModel.js'

class Doctor extends SqlModel {
  constructor(data = {}, isNew = true) {
    super({ available: true, slots_booked: {}, ...data }, isNew)
  }
}

Doctor.table = 'doctors'
Doctor.fields = [
  '_id', 'name', 'email', 'password', 'speciality', 'degree',
  'experience', 'about', 'available', 'fees', 'address', 'date', 'slots_booked'
]

export default Doctor
