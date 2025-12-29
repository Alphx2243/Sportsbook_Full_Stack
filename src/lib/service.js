import { createSport, updateSport, deleteSport, getSport, getSports } from '@/actions/sports'
import { createBooking, updateBooking, deleteBooking, getBooking, getBookings, extendBooking, expireBooking, secureBooking } from '@/actions/bookings'
import { uploadFile, getFilePreview } from '@/actions/files'
import { createUser, updateUser, deleteUser, getUser, getUsers } from '@/actions/auth'
import { createMatch, getMatches, updateMatch, deleteMatch } from '@/actions/matches'
import { createInvite, getInvites, editInvite, deleteInvite } from '@/actions/invites'
import { createApplication, getApplications, deleteApplication } from '@/actions/applications'

export class Service {

  async createSport(data) { return await createSport(data) }

  async updateSport(documentId, data) { return await updateSport(documentId, data) }

  async deleteSport(documentId) { return await deleteSport(documentId) }

  async getSport(documentId) { return await getSport(documentId) }

  async getSports(queries = []) { return await getSports() }

  subscribeToSportsCollection = (callback) => {
    console.warn('Realtime subscription not supported in Postgres migration yet')
    return () => { }
  }

  // --------- User Functions ----------

  async createUser(data) { return true }

  async updateUser(documentId, data) { return await updateUser(documentId, data) }

  async deleteUser(documentId) { return true }

  async getUser(documentId) { return null }

  async getUsers(queries = []) { return await getUsers() }

  async getDocumentIdByEmail(email) { return null }

  // --------- Booking Functions ----------

  async createBooking(data) { return await createBooking(data) }

  async secureBooking(data) { return await secureBooking(data) }

  async updateBooking(documentId, data) { return await updateBooking(documentId, data) }

  async deleteBooking(documentId) { return await deleteBooking(documentId) }

  async getBooking(documentId) { return await getBooking(documentId) }

  async getBookings(filters = {}) { return await getBookings(filters) }

  async expireBooking(bookingId) { return await expireBooking(bookingId) }

  subscribeToBookingsCollection = (callback) => { return () => { } }

  // --------- File Upload Functions ----------

  async uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await uploadFile(formData)
  }

  async deleteFile(fileId) { return true }

  getFilePreview(fileId) {
    if (!fileId) return '/sblogo.png'
    if (String(fileId).startsWith('http')) return fileId
    return `/uploads/${fileId}`
  }

  async getFileId(fileName) { return null }

  //--------- Scoring Functions ----------

  subscribeToCollection = (callback) => { return () => { } }

  async createMatch(data) { return await createMatch(data) }

  async getMatches(filters = {}) { return await getMatches(filters) }

  getDocuments = async () => {
    const res = await getMatches()
    return res.documents || []
  }

  async updateMatch(documentId, data) { return await updateMatch(documentId, data) }

  async deleteMatch(documentId) { return await deleteMatch(documentId) }

  //--------- Application for guide Functions ----------

  async createApplication(data) { return await createApplication(data) }

  async getApplications() { return await getApplications() }

  async deleteApplication(documentId) { return await deleteApplication(documentId) }

  //--------- Invite Functions ----------

  async createInvite(data) { return await createInvite(data) }

  async getInvites() { return await getInvites() }

  async editInvite(documentId) { return await editInvite(documentId) }

  async deleteInvite(documentId) { return await deleteInvite(documentId) }
}

const service = new Service();
export default service;

