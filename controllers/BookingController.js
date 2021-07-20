const BookingService = require('../services/BookingService');
const EmailService = require('../services/EmailService');

const { parse } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');


module.exports = {
    addBooking: async (addedBy, customerId, productType, bookingDate, transportDate, repeat, sourceId, location, vehicleType, link, fileURL, remarks) => {

        const defaultTicket = () => ({
            receiptId   : null,
            vehicleId: null,
            weight: null,
            image: null,
        })

        var bookingDateObj = parse(bookingDate, 'dd/MM/yyyy', new Date());
        var transportDateObj = parse(transportDate, 'dd/MM/yyyy', new Date());

        var tickets = [];

        for (var i = repeat - 1; i >= 0; i--) {
            tickets.push(defaultTicket());
        }

        const logistic = {
            location,
            vehicleType,
        }

        return BookingService.addBooking(addedBy, customerId, productType, bookingDateObj, transportDateObj, repeat, tickets, sourceId, link, fileURL, remarks, logistic);
    },

    approveBooking: async (bookingId, isApprove) => {

        if(isApprove){
            return BookingService.changeBookingStatus(bookingId, 'Approved');
        } else {
            return BookingService.changeBookingStatus(bookingId, 'Rejected');
        }

    },

    getAllBookings: async () => {
        return BookingService.getAllBookings();
    },

    getBookingsByTransportDate: async (startDate, endDate) => {
        return BookingService.getBookingsByTransportDate(startDate, endDate);
    },

    getBookingById: async (id) => {
        return BookingService.getBookingById(id);
    },

    addProduct: async (productName) => {
        return BookingService.addProduct(productName);
    },

    getAllProducts: async () => {
        return BookingService.getAllProducts();
    },

    addLogistic: async (logisticName, location, vehicleType, price, estimatedAmount) => {
        return BookingService.addLogistic(logisticName, location, vehicleType, price, estimatedAmount);
    },
    addLogisticToBooking: async (addedBy, bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount, transportDate) => {
        return BookingService.addLogisticToBooking(addedBy, bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount, transportDate);
    },
    addLogisticProvider: async (name) => {
        return BookingService.addLogisticProvider(name);
    },
    getAllLogisticProviders: async () => {
        return BookingService.getAllLogisticProviders();
    },
    addCustomer: async (name) => {
        return BookingService.addCustomer(name);
    },
    addSource: async (name) => {
        return BookingService.addSource(name);
    },
    getAllCustomers: async () => {
        return BookingService.getAllCustomers();
    },
    getAllSources: async () => {
        return BookingService.getAllSources();
    },
    addScaleToBooking: async (bookingId, ticketIndex, receiptId, vehicleId, weight, image, transportDate) => {
        return BookingService.addScaleToBooking(bookingId, ticketIndex, receiptId, vehicleId, weight, image, transportDate);
    },
    getBookingTicketsById: async (id) => {
        return BookingService.getBookingTicketsById(id);
    },
    updateSourceInBookings: async () => {
        return BookingService.updateSourceInBookings();
    },
    getNewAnalyticsData: async (year, month) => {
        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month+1, 1);

        const data = await BookingService.getBookingsByCompletedDate(firstDay, lastDay);

        const yearlyData = await BookingService.getBookingsByCompletedDate(new Date(year, 0, 1), new Date(year, 12, 1));

        function getUniqueRoutes(data) {
            var routes = {}
            var routeCount = 0;

            data.map(booking => {
                const { source, customer } = booking;

                const sourceName = source?.name
                
                if(!routes.hasOwnProperty(sourceName)) {
                    routes[sourceName] = new Set();
                }
                routes[sourceName].add(customer.name);
            });

            Object.keys(routes).map(function(key, index) {
                routes[key] = Array.from(routes[key]);
                routeCount += routes[key].length
            });

            return [routes, routeCount]
        }

        function getDestinationsFrequency(data) {
            const destinations = data.map(booking => booking.customer.name);

            var occurrences = {};
            for (var i = 0, j = destinations.length; i < j; i++) {
               occurrences[destinations[i]] = (occurrences[destinations[i]] || 0) + 1;
            }

            return occurrences;
        }

        function getSourceFrequency(data) {
            const destinations = data.map(booking => {
                if(booking.logistic) {
                    return booking.source?.name
                }
            });

            var occurrences = {};
            for (var i = 0, j = destinations.length; i < j; i++) {
               occurrences[destinations[i]] = (occurrences[destinations[i]] || 0) + 1;
            }

            return occurrences;
        }

        function getVehicleWeightsByDay(data, getAvg = false) {

            const vehicleMap = {}

            var totalWeight = 0;
            var ticketCount = 0;

            const vehicles = [].concat(...data.map(booking => booking.tickets.map(ticket => {

                const { vehicleId, weight } = ticket;
                const { transportDate } = booking;

                // console.log(vehicleId, weight, transportDate, transportDate.getDate());

                if(!vehicleMap.hasOwnProperty(vehicleId)){
                    vehicleMap[vehicleId] = new Array(new Date(year, month+1, 0).getDate()).fill(0);
                }             

                vehicleMap[vehicleId][transportDate.getDate()-1] += parseFloat(weight);
                totalWeight += parseFloat(weight);
                ticketCount++;

            })));

            if(getAvg) {
                return [vehicleMap, totalWeight/ticketCount]
            }

            return vehicleMap;

        }

        function getWeightsByMonth(data) {
            var months = [0,0,0,0,0,0,0,0,0,0,0,0];

            const tickets = data.map(booking => booking.tickets.map(ticket => {
                months[booking.transportDate.getMonth()] += parseFloat(ticket.weight);

            }));

            return months;
        }

        const [trucks, weightAvg] = getVehicleWeightsByDay(data, true)
        const [routes, routeCount] = getUniqueRoutes(data)

        var analysisData = {
            dateRange: [firstDay, lastDay],
            fleets: [...new Set([].concat(...data.map(booking => booking.tickets.map(ticket => ticket.vehicleId))))],
            rounds: data.map(booking => booking.tickets.length).reduce((a, b) => a + b, 0),
            tons: data.map(booking => booking.tickets.reduce((a, b) => a + parseFloat(b.weight), 0)).reduce((a, b) => a + b, 0),
            routes: routes,
            routeCount: routeCount,
            weightAvg: weightAvg,
            sources: getSourceFrequency(data),
            destinations: getDestinationsFrequency(data),
            trucks: trucks,
            yearlyWeights: getWeightsByMonth(yearlyData),


        }

        return analysisData;
    }

}
