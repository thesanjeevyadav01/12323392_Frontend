import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';  
import { getBookingData } from './API'; 
import DatePicker from 'react-datepicker';  
import "react-datepicker/dist/react-datepicker.css";  
import './App.css'; 

const App = () => {
  const [bookingData, setBookingData] = useState([]);
  const [error, setError] = useState(null); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);  

  useEffect(() => {
    getBookingData()
      .then(data => {
        setBookingData(data);  // Store the cleaned data
      })
      .catch(err => {
        console.error("Failed to fetch booking data:", err);
        setError("Failed to load booking data.");
      });
  }, []);

  // here i'm using the function for Aggregate the data to calculate visitors per day
  const aggregateTimeSeriesData = bookingData.reduce((acc, booking) => {
    const dateKey = new Date(
      Date.UTC( 
        booking.arrival_date_year,
        booking.arrival_date_month - 1, // Month is 0-indexed in JavaScript
        booking.arrival_date_day_of_month
      )
    ).toISOString().split('T')[0];  // Format as YYYY-MM-DD

    const visitors = booking.adults + booking.children + booking.babies;

    if (!acc[dateKey]) {
      acc[dateKey] = visitors; 
    } else {
      acc[dateKey] += visitors;  
    }

    return acc;
  }, {});

  // Convert the aggregated object back into an array of objects
  const timeSeriesData = Object.keys(aggregateTimeSeriesData).map(date => ({
    x: new Date(date),
    y: aggregateTimeSeriesData[date],
  }));

  // Aggregate Adults and Children Data by Date
  const aggregateVisitorsData = (key) => {
    return bookingData.reduce((acc, booking) => {
      const dateKey = new Date(
        Date.UTC(  
          booking.arrival_date_year,
          booking.arrival_date_month - 1,
          booking.arrival_date_day_of_month
        )
      ).toISOString().split('T')[0];

      const count = booking[key];

      if (!acc[dateKey]) {
        acc[dateKey] = count;
      } else {
        acc[dateKey] += count;
      }

      return acc;
    }, {});
  };

  const adultsData = Object.keys(aggregateVisitorsData('adults')).map(date => ({
    x: new Date(date),
    y: aggregateVisitorsData('adults')[date],
  }));

  const childrenData = Object.keys(aggregateVisitorsData('children')).map(date => ({
    x: new Date(date),
    y: aggregateVisitorsData('children')[date],
  }));

  // Column Chart (Visitors by Country)
  const countryData = bookingData.reduce((acc, booking) => {
    const bookingDate = new Date(
      Date.UTC( 
        booking.arrival_date_year,
        booking.arrival_date_month - 1,
        booking.arrival_date_day_of_month
      )
    );

    // Only consider bookings within the selected date range
    if ((!startDate || bookingDate >= startDate) && (!endDate || bookingDate <= endDate)) {
      const visitors = booking.adults + booking.children + booking.babies;
      acc[booking.country] = (acc[booking.country] || 0) + visitors;
    }

    return acc;
  }, {});


  if (error) {
    return <div>{error}</div>;
  }

  
  const filterDataByDateRange = (data) => {
    return data.filter(dataPoint => {
      return (!startDate || dataPoint.x >= startDate) && (!endDate || dataPoint.x <= endDate);
    });
  };

  const filteredTimeSeriesData = filterDataByDateRange(timeSeriesData);
  const filteredAdultsData = filterDataByDateRange(adultsData);
  const filteredChildrenData = filterDataByDateRange(childrenData);

  const totalAdults = bookingData.reduce((acc, booking) => acc + booking.adults, 0);
  const totalChildren = bookingData.reduce((acc, booking) => acc + booking.children, 0);

  //here i've checked the data is being calculating properly or not
  // console.log(totalAdults);
  // console.log(totalChildren);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Hotel Booking Dashboard</h1>
      </div>
        <div>
          <h3>Date Format is : MM/DD/YYYY (For Date Range)</h3>
        </div>
      <div className="date-picker-container">
        <label>Select Date Range:</label>
        <DatePicker 
          selected={startDate} 
          onChange={date => setStartDate(date)} 
          selectsStart 
          startDate={startDate} 
          endDate={endDate} 
          placeholderText="Start Date"
        />
        <DatePicker 
          selected={endDate} 
          onChange={date => setEndDate(date)} 
          selectsEnd 
          startDate={startDate} 
          endDate={endDate} 
          placeholderText="End Date"
          minDate={startDate}  
        />
      </div>

      {bookingData.length > 0 ? (
        <>
          <div className="chart-container">
            <Chart
              options={{
                chart: {
                  type: 'line',
                  zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                  },
                },
                
                title: {
                  text: 'Visitors Over Time',
                  align: 'left'
                },
                xaxis: {
                  type: 'datetime',
                  title: {
                    text: 'Date'
                  }
                },
                yaxis: {
                  title: {
                    text: 'Number of Visitors'
                  },
                  labels: {
                    formatter: function (val) {
                      return val; 
                    }
                  }
                },
                tooltip: {
                  shared: true,
                  intersect: false,
                  y: {
                    formatter: function (val) {
                      return val; 
                    }
                  }
                },
                dataLabels: {
                  enabled: false
                },
                markers: {
                  size: 0,
                },
              }}
              series={[{ name: 'Visitors', data: filteredTimeSeriesData }]}
              type="line"
              height={350}
            />
          </div>

         
          <div className="chart-container">
            {(() => {
              
              const sortedCountryData = Object.entries(countryData)
                .sort((a, b) => b[1] - a[1]); // Sort by visitor count in ascending order so that the graph should be properly visualized

        
              const sortedCountryNames = sortedCountryData.map(entry => entry[0]);
              const sortedCountryVisitors = sortedCountryData.map(entry => entry[1]);

              return (
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: true, 
                        tools: {
                          zoom: false, 
                          reset: true, 
                        },
                      },
                      zoom: {
                        enabled: true, 
                      },
                    },
                    xaxis: {
                      categories: sortedCountryNames, 
                      title: { text: 'Country' },
                    },
                    yaxis: {
                      title: { text: 'Number of Visitors' },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val; 
                      },
                      style: {
                        fontSize: '12px',
                        colors: ['#000000'],
                      },
                      offsetY: -20,
                    },
                    plotOptions: {
                      bar: {
                        dataLabels: {
                          position: 'top', 
                          offsetY: -20,  
                        },
                      },
                    },
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return `${val} visitors`;
                        },
                      },
                    },
                  }}
                  series={[{ name: 'Visitors', data: sortedCountryVisitors }]} 
                  type="bar"
                  height={350}
                />
              );
            })()}
          </div>

          <div className='sparkline-row'>
  <div className='sparkline'>
    <Chart
      options={{
        chart: {
          type: 'line',
          sparkline: { enabled: true },
          toolbar: { show: false },
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        xaxis: {
          type: 'datetime',
          labels: { show: false },
        },
        yaxis: {
          labels: { show: false },
        },
        title: {
          text: `${totalAdults}`, // This will show the total count of adults in the sparkling charts
          align: 'left',
          style: {
            fontSize: '14px',
          },
        },
        subtitle: {
          text: 'Total Adults',
          align: 'left',
          style: {
            fontSize: '14px',
          },
        },
      }}
      series={[{ name: 'Adults', data: filteredAdultsData }]}
      type="line"
      height={200}
    />
  </div>
  
  <div className='sparkline'>
    <Chart
      options={{
        chart: {
          type: 'line',
          sparkline: { enabled: true },
          toolbar: { show: false },
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        xaxis: {
          type: 'datetime',
          labels: { show: false },
        },
        yaxis: {
          labels: { show: false },
        },
        title: {
          text: `${totalChildren}`, // this will show total children count in the title
          align: 'left',
          style: {
            fontSize: '14px',
          },
        },
        subtitle: {
          text: 'Total Children',
          align: 'left',
          style: {
            fontSize: '12px',
          },
        },
      }}
      series={[{ name: 'Children', data: filteredChildrenData }]}
      type="line"
      height={200}
    />
  </div>
</div>


        </>
      ) : (
        <p>No booking data available.</p>
      )}
    </div>
  );
};

export default App;