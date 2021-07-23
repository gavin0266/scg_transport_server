var xl = require('excel4node');
const BookingService = require('../services/BookingService');

const { DateTime } = require("luxon");


function toShortDate(date) {
    var dateFormat = require('dateformat');

    return dateFormat(date, "dd/mm/yyyy");
}

module.exports = {
    createOrders: async (wb, startDate, endDate) => {
        var ws = wb.addWorksheet('Log Sheet');

        var headerStyle = wb.createStyle({
          alignment: {
            horizontal: "center",
          },
          font: {
            color: '#000000',
            size: 11,
            name: 'Calibri',
          },
          fill: { type: 'pattern', patternType: 'solid', fgColor: '#ffff00', bgColor: "#ff0000" },
          border: {
            right: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
          }
        });

        var contentStyle = wb.createStyle({
          font: {
            color: '#00b050',
            size: 11,
            name: 'Calibri',
          },
          border: {
            right: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'hair',
                color: '#000000'
            }
          }
        });

        ws.row(1).freeze();
        

        ws.cell(1, 1).string("วัน/เดือน/ปี").style(headerStyle);
        ws.column(1).setWidth(15);
        ws.cell(1, 2).string("เดือน").style(headerStyle);
        ws.column(2).setWidth(15);
        ws.cell(1, 3).string("ปี").style(headerStyle);
        ws.column(3).setWidth(15);
        ws.cell(1, 4).string("ชื่อลูกค้า (นิติบุคคล/บุคคล)").style(headerStyle);
        ws.column(4).setWidth(50);
        ws.cell(1, 5).string("เลขที่ใบชั่ง").style(headerStyle);
        ws.column(5).setWidth(15);
        ws.cell(1, 6).string("ประเภทสินค้า").style(headerStyle);
        ws.column(6).setWidth(15);
        ws.cell(1, 7).string("ทะเบียนรถ").style(headerStyle);
        ws.column(7).setWidth(15);
        ws.cell(1, 8).string("บริษัทขนส่ง").style(headerStyle);
        ws.column(8).setWidth(18)
        ws.cell(1, 9).string("บริษัทต้นทาง").style(headerStyle);
        ws.column(9).setWidth(18)
        ws.cell(1, 10).string("นน.สุทธิปลายทาง (ตัน)").style(headerStyle);
        ws.column(10).setWidth(18)

        const bookings = await BookingService.getCompletedBookingsByTransportDate(startDate, endDate, {'transportDate': 1});

        if (bookings) {
            var rowIndex = 2;

            bookings.forEach((booking) => {

                const {completedAt, customer, productType, source, transportDate } = booking;
                if (booking.logistic) {

                    const { logisticProvider } = booking.logistic;

                    booking.tickets.forEach((ticket) => {
                        if(ticket.filled) {
                            const localTransportDate = DateTime.fromISO(transportDate.toISOString()).setZone('Asia/Bangkok');

                            let { c } = localTransportDate;

                            ws.cell(rowIndex, 1).date(Date.UTC(c.year, c.month-1, c.day)).style({...contentStyle, numberFormat: 'dd/MM/yy'});
                            ws.cell(rowIndex, 2).string(transportDate.toLocaleString('th', { month: 'long' })).style(contentStyle);
                            ws.cell(rowIndex, 3).number(transportDate.getFullYear()).style(contentStyle);
                            ws.cell(rowIndex, 4).string(customer ? customer.name : "-").style(contentStyle);
                            ws.cell(rowIndex, 5).string(ticket ? ticket.receiptId : "-").style(contentStyle);
                            ws.cell(rowIndex, 6).string(productType).style(contentStyle);
                            ws.cell(rowIndex, 7).string(ticket ? ticket.vehicleId : "-").style(contentStyle);
                            ws.cell(rowIndex, 8).string(logisticProvider ? logisticProvider.name : "-").style(contentStyle);
                            ws.cell(rowIndex, 9).string(source?.name ? source.name : "-").style(contentStyle);
                            ws.cell(rowIndex, 10).number(parseFloat(ticket.weight)).style({numberFormat: '#,##0.00; (#,##0.00); -',}).style(contentStyle);
                            
                            rowIndex++;
                        }
                    })
                }

            });

            ws.cell(rowIndex, 1).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 2).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 3).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 4).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 5).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 6).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 7).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 8).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 9).style({border: {top: {style: 'thin', color: "#000000"}}});
            ws.cell(rowIndex, 10).style({border: {top: {style: 'thin', color: "#000000"}}});
        }

    },
}

