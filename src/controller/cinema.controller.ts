import { Request, Response } from 'express';
import { CinemaService } from '../service/cinema.service';
import { Booking } from '../sreen.type';
import { StatusCodes } from 'http-status-codes';
import log from '../utilityClass/logger';

export class CinemaController{
    private cinemaService = new CinemaService(4); // configurable maximum capacity parameter

    public async bookTickets(req: Request, res: Response): Promise<void> {
      const TicketBooking : Booking = {
        screenName: req.body.screenName,
        requestedSeats: req.body.requestedSeats,
        showtime : req.body.showtime,
        price : req.body.price,
        movieTitle : req.body.movieTitle,
       hallNumber : req.body.hallNumber,
       status : req.body.status,
       bookingId: ""
    }
      try {
          const {booking, bookingId}= await this.cinemaService.bookTickets(TicketBooking);
          log.info({booking});
          res.status(StatusCodes.ACCEPTED).json({bookingId, message : 'Tickets booked successfully.'})
      } catch (error) {
          log.info(error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing the request.' });
      }
       
      }
      
}

