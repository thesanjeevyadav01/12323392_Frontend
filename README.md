# Hotel Booking Dashboard

## Project Overview

This project is a web-based **Hotel Booking Dashboard** that visualizes hotel booking data. It provides key insights such as total visitors over time, visitors categorized by adults and children, and a breakdown of visitors by country. The dashboard is built using **React**, **ApexCharts**, and **React DatePicker**, with data parsed from a CSV file using **Papa Parse**.

## Features

- **Interactive Date Range Filter**: Select a custom date range to view booking data.
- **Zoomable Time Series Chart**: Visualize the number of visitors over time with zoom functionality.
- **Visitors by Country**: View a bar chart of the number of visitors from different countries.
- **Sparkline Charts**: Display total adults and children count with small line charts for quick reference.

## Project Structure

- `API.js`: Contains the logic for parsing the hotel booking CSV data and converting it into a usable format for visualization.
- `App.js`: The main component that handles the state, fetches booking data, and renders charts based on the selected date range.
- `App.css`: Contains styles for the overall layout and components, ensuring a clean and modern user interface.

## How to Run the Project

### Prerequisites

- **Node.js** and **npm** installed.
- **React** set up in your environment.

### Installation

1. Clone this repository to your local machine:
    ```bash
    git clone https://github.com/thesanjeevyadav01/12323392_Frontend.git
    ```
   
2. Navigate into the project directory:
    ```bash
    cd hotel-booking-dashboard
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm start
    ```

5. Open the application in your browser at `http://localhost:3000`.

### Data Source

The project uses a CSV file (`hotel_bookings_1000.csv`) containing 1000 records of hotel bookings with the following key columns:
- `hotel`
- `arrival_date_year`
- `arrival_date_month`
- `arrival_date_day_of_month`
- `adults`
- `children`
- `babies`
- `country`

The data is parsed using **Papa Parse** and then displayed through various charts.

## Technologies Used

- **React**: Front-end library for building the user interface.
- **ApexCharts**: JavaScript charting library used for data visualization.
- **Papa Parse**: Library for parsing CSV files in JavaScript.
- **React DatePicker**: A date picker component used for selecting date ranges.

## Usage

1. Select a date range using the date picker to filter data within that time frame.
2. View visitors over time with the zoomable line chart.
3. Analyze visitors by country using the bar chart.
4. Observe the total number of adults and children in the sparkline charts.

## Future Improvements

- Add more filters to refine data by hotel, room type, or booking status.
- Implement data export functionality to download filtered results as CSV.
- Enhance error handling and improve performance for larger datasets.


## Contact

If you have any questions or suggestions, feel free to reach out at [thesanjeevyadav01@gmail.com](mailto:thesanjeevyadav01@gmail.com).
