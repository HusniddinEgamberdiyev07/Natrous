const express = require("express");
const {getAllTours, getTour, createTour, deleteTour, updateTour, tourStats, getMonthlyPlan} = require("../controller/tours")

const tourRouter = express.Router();

tourRouter
    .route("/")
    .get(getAllTours)
    .post(createTour)

tourRouter
    .route("/stats")
    .get(tourStats)

tourRouter
.route("/monthly-plans/:year")
.get(getMonthlyPlan)

tourRouter
    .route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = tourRouter;