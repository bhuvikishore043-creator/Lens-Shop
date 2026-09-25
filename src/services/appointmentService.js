import { getStorageData, setStorageData } from './storageService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const appointmentService = {
  async getAppointments() {
    const appointments = getStorageData(LOCAL_STORAGE_KEYS.APPOINTMENTS) || [];
    return Promise.resolve(appointments);
  },

  async bookAppointment(details) {
    const appointments = await this.getAppointments();
    const newAppointment = {
      id: details.bookingRef || `LUM-OPT-${Math.floor(100000 + Math.random() * 900000)}`,
      callStatus: 'Pending',
      optometrist: details.optometrist || 'Alex Rivera',
      notes: 'Online booking via Free Eye Test form.',
      ...details
    };
    appointments.unshift(newAppointment);
    setStorageData(LOCAL_STORAGE_KEYS.APPOINTMENTS, appointments);
    return Promise.resolve(newAppointment);
  },

  async updateCallStatus(appointmentId, newCallStatus, note = '') {
    const appointments = await this.getAppointments();
    const updated = appointments.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          callStatus: newCallStatus,
          notes: note || apt.notes
        };
      }
      return apt;
    });
    setStorageData(LOCAL_STORAGE_KEYS.APPOINTMENTS, updated);
    return Promise.resolve(updated.find(a => a.id === appointmentId));
  },

  async updateStatus(appointmentId, newStatus) {
    const appointments = await this.getAppointments();
    const updated = appointments.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          status: newStatus,
          callStatus: newStatus === 'Confirmed' ? 'Confirmed' : apt.callStatus
        };
      }
      return apt;
    });
    setStorageData(LOCAL_STORAGE_KEYS.APPOINTMENTS, updated);
    return Promise.resolve(updated);
  }
};
