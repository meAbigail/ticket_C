import { Mutex, Semaphore } from "async-mutex"; // Imprted Semaphore from async-mutex
import dotenv from 'dotenv';

import Main from "../utilityClass/main";
import {TicketBooking } from "../Interface/cinema.interface";
import CinemaRepository from "../repository/cinema.repo";
import { Booking } from "../sreen.type";
import { BookingStatus, ScreenOptions } from "../utilityClass/enums.options";
dotenv.config();


export class CinemaService {
  private MAX_CAPACITY: number;
  private semaphore:Semaphore; // Semaphore decalred as private variable
  private utility = new Main();
  private cinemaRepository = new CinemaRepository();

  constructor(maxCapacity: number) {
    this.MAX_CAPACITY = maxCapacity;
    this.semaphore = new Semaphore(maxCapacity); // Initializes Semaphore variable by creating a new instance from Semaphore class
  }

  public async bookTickets(ticketPayload: Booking): Promise<{ booking: TicketBooking, bookingId: string }> {
    const bookingId = this.utility.generateBookingId();
    const currentBookingCount = await this.cinemaRepository.countBooking();
    const availableSeats = this.calculateAvailableSeats(currentBookingCount);

    if (availableSeats <= 0) {
      throw new Error('No available seats');
    }

    if (ticketPayload.requestedSeats > availableSeats) {
      throw new Error('Requested number of seats exceeds available seats');
    }

    const showtime = this.calculateShowtime(ticketPayload);
    const booking = await this.createBooking(ticketPayload, bookingId, availableSeats, showtime);
    // releases a permit from semapore which enable other processes to proceed with the task
    this.semaphore.release();

    return {booking, bookingId};
  }

  private calculateAvailableSeats(currentBookingCount: number): number {
  let availableSeats: number;

  if (currentBookingCount > 0) {
    availableSeats = this.MAX_CAPACITY - currentBookingCount;
  } else {
    availableSeats = this.MAX_CAPACITY;
  }
  return availableSeats;
}

  private async createBooking(ticketPayload: Booking, bookingId: string, availableSeats : number, showtime: string): Promise<TicketBooking> {
   
    if (availableSeats === 0 || ticketPayload.requestedSeats > availableSeats) {
      throw new Error('No available seats');
    }
  
    const hallNumberOptions = 2 || 4;
    const priceOptions = 10 || 13 || 14 || 20;
    const movieTitleOptions = "a" || "b";
  
    let status: BookingStatus = BookingStatus.Available;
  
    if (availableSeats < ticketPayload.requestedSeats) {
      status = BookingStatus.NotAvailable;
    }

    return this.cinemaRepository.createBooking({
      seats: ticketPayload.requestedSeats,
      hallNumber: hallNumberOptions,
      price: priceOptions ,
      screen: ticketPayload.screenName as ScreenOptions,
      showtime,
      movieTitle:  movieTitleOptions,
      bookingId: bookingId,
      status: status
    });
  }


  private calculateShowtime(ticketPayload: Booking): string {
    const { hallNumber, price, movieTitle, screenName } = ticketPayload;

    let showtime : string = '';
    if (screenName === ScreenOptions.Screen1) {
      if (hallNumber === 2 && price === 10 && movieTitle === 'a') {
        showtime = '10:00 AM';
      } else if (hallNumber === 4 && price === 13 && movieTitle === 'b') {
        showtime = '1:00 PM';
      }
    } else if (screenName === ScreenOptions.Screen2) {
      if (hallNumber === 2 && price === 14 && movieTitle === 'a') {
        showtime = '3:00 PM';
      } else if (hallNumber === 4 && price === 20 && movieTitle === 'b') {
        showtime = '6:00 PM';
      }
    }
    if (!showtime) {
      throw new Error('The provided ticket details do not match any available showtimes.');
    }
  
    return showtime;
  }

}