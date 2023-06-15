import { ScreenOptions } from "./utilityClass/enums.options"


type Booking = {
    screenName: ScreenOptions,
      requestedSeats: number,
      showtime: string,
      price: number,
      movieTitle: string,
      hallNumber: number,
      status: string,
      bookingId: string
}

export {Booking}