import SqlModel from './sqlModel.js'

class Appointment extends SqlModel {}
Appointment.table = 'appointments'
Appointment.orderColumn = 'date'
Appointment.fields = [
  '_id', 'userId', 'docId', 'slotDate', 'slotTime', 'userData', 'docData',
  'amount', 'date', 'cancelled', 'payment', 'paymentMethod', 'paymentDate',
  'paymentReference', 'isCompleted'
]

export default Appointment
