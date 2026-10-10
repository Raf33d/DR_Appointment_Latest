import SqlModel from './sqlModel.js'

class User extends SqlModel {
  constructor(data = {}, isNew = true) {
    super({
      image: '',
      phone: '00000000000',
      address: { line1: 'Not Selected', line2: 'Not Selected' },
      gender: 'Not Selected',
      dob: 'Not Selected',
      ...data
    }, isNew)
  }
}

User.table = 'users'
User.fields = ['_id', 'name', 'email', 'password', 'image', 'phone', 'address', 'gender', 'dob']

export default User
