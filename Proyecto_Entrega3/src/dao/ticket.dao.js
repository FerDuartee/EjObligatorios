import ticketModel from '../models/tickets.model.js';

export default class TicketDao {
  createTicket = async (ticketData) => {
    try {
      const ticket = new ticketModel(ticketData);
      const savedTicket = await ticket.save();
      return savedTicket;
    } catch (error) {
      throw error;
    }
  }
}
