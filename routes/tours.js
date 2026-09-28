const express = require("express");
const {getAllTours, getTour, createTour, deleteTour, updateTour, tourStats, getMonthlyPlan} = require("../controller/tours")
const {protect, restrictedTo} = require("../controller/auth")

const tourRouter = express.Router();

tourRouter
    .route("/")
    .get(protect, getAllTours)
    .post(protect, createTour)

tourRouter
    .route("/stats")
    .get(protect, tourStats)

tourRouter
.route("/monthly-plans/:year")
.get(protect, getMonthlyPlan)

tourRouter
    .route("/:id")
    .get(protect, getTour)
    .patch(protect, updateTour)
    .delete(protect,restrictedTo("admin", "lead-guide"), deleteTour)

module.exports = tourRouter;