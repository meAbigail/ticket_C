import { Router } from "express";
import  {OpenAPI} from 'openapi-types';
import { CinemaController } from "../controller/cinema.controller";

const cinemaController = new CinemaController();
const cinemaRouter = Router();

cinemaRouter.post('/book', cinemaController.bookTickets.bind(cinemaController));


export default cinemaRouter;