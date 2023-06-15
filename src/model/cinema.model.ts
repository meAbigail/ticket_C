import mongoose, { Schema } from "mongoose";
import {  TicketBooking } from "../Interface/cinema.interface";
import { ScreenOptions } from "../utilityClass/enums.options";


const BookingSchema = new Schema<TicketBooking>({
    screen:  String,
    seats: { type: Number, required: true },
    showtime: { type: String, required: true },
    price: { type: Number, required: true },
    status:{ type: String, required: true },
    movieTitle: { type: String, required: true },
    hallNumber: { type: Number, required: true },
    bookingId: {type: String}
  });

export const BookedTickets= mongoose.model<TicketBooking>('BookTicket', BookingSchema)