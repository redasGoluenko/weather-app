# Weather App

A minimal weather forecasting app built with **Vue 3 + Vite**, **TypeScript**, **Axios**, and **Bulma**.

## Features

- Search by **city**, **ZIP**, or **coordinates**
- Forecasts saved in **localStorage**
- Auto-refresh every 10 minutes
- Filter & paginate saved forecasts
- Weather icons
- Error handling with notifications
- Bulma CSS framework

## Setup Instructions

### Prerequisites

Make sure you have **Node.js** (v14 or later) and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/redasGoluenko/weather-app.git
   ```
   ```bash
   cd weather-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Add your OpenWeatherMap API key:**
Create a .env file in the root directory and add the following line:
```bash
VITE_WEATHER_API_KEY=YOUR_API_KEY_HERE
```
### Running the app locally
1. Start the development server:
```bash
npm run dev
```
2. Open your browser and navigate to the URL shown

### Building for production
To build the app for production deployment:
```bash
npm run build
```
The compiled files will be in the /dist folder.

### Serving the production build locally
To preview the production build locally, you can use a simple HTTP server. For example, with http-server:
1. Install http-server globally
```bash
npm install -g http-server
```
2. Serve the dist folder
```bash
http-server dist
```
3. Open your browser at the URL displayed
## Usage
- Click Add Forecast to open the modal and enter a city name, ZIP code, or coordinates.
- Search to fetch the latest weather.
- Add the forecast to your saved list.
- Use the filter input to search saved forecasts by city or country.
- Remove forecasts using the Remove button.
- The app auto-refreshes all saved forecasts every 10 minutes