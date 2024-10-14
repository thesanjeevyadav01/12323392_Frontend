// I've used papaparse library for csv parsing 
import Papa from 'papaparse';
import hotelBookingsCsv from './hotel_bookings_1000.csv';

// Here converting the months name into numbers so it is easy for manipulations...
const monthToNumber = (arrival_date_month) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  const monthNumber = monthNames.indexOf(arrival_date_month) + 1; 
  return monthNumber
};

export const getBookingData = async () => {
  const response = await fetch(hotelBookingsCsv);
  const text = await response.text();
  return new Promise((resolve) => {
    Papa.parse(text, {
       // Here skipping the first line of csv file as it is for header..
      header: true,       
      skipEmptyLines: true, 
      complete: (result) => {
        const cleanedData = result.data.map((entry) => {
          const month = monthToNumber(String(entry.arrival_date_month).trim());

          let hotel;
          if (entry.hotel) {
            hotel = String(entry.hotel).trim();
          } else {
            hotel = '';
          }

          let arrival_date_year;
          if (entry.arrival_date_year) {
            arrival_date_year = parseInt(entry.arrival_date_year, 10);
          } else {
            arrival_date_year = 0;
          }

          let arrival_date_month = month;

          let arrival_date_day_of_month;
          if (entry.arrival_date_day_of_month) {
            arrival_date_day_of_month = parseInt(entry.arrival_date_day_of_month, 10);
          } else {
            arrival_date_day_of_month = 1;
          }

          let adults;
          if (entry.adults) {
            adults = parseInt(entry.adults, 10);
          } else {
            adults = 0;
          }

          let children;
          if (entry.children) {
            children = parseInt(entry.children, 10);
          } else {
            children = 0;
          }

          let babies;
          if (entry.babies) {
            babies = parseInt(entry.babies, 10);
          } else {
            babies = 0;
          }

          //fetching the country name if the country name is empty or NULL it will be consider into "OTHERS" parts..
          let country;
          if (entry.country) {
            if(entry.country === 'NULL'){
              entry.country = 'OTHERS';
              country = String(entry.country).trim();
            }
            country = String(entry.country).trim();
          } else {
            country = 'OTHERS';
          }

          // Returning the cleaned data for the current entry
          return {
            hotel,
            arrival_date_year,
            arrival_date_month,
            arrival_date_day_of_month,
            adults,
            children,
            babies,
            country,
          };
        });


        // Here I'm Resolving the promise with the cleaned data array
        resolve(cleanedData);
      },
    });
  });
};
