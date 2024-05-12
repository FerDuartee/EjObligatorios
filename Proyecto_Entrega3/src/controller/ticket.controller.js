import TicketDAO from '../dao/ticket.dao.js';

export const generateTicket = async (ticketData) => {
  try {
    const ticket = await TicketDAO.createTicket(ticketData);
    return ticket;
  } catch (error) {
    throw error;
  }
}