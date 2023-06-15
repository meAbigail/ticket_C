import { TicketBooking } from "../Interface/cinema.interface";
import { BookedTickets } from "../model/cinema.model";




export default class CinemaRepository {
    public async createBooking(booking : TicketBooking): Promise<TicketBooking>{
        return BookedTickets.create(booking)
    }

    public async countBooking(): Promise<number> {
      const bookedTickets = await BookedTickets.find({ status: "available" }).lean();
      const totalBookedSeats = bookedTickets.reduce((sum, ticket) => sum + ticket.seats, 0);
      return totalBookedSeats;
    }
    
    
  }