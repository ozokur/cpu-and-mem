# Temperature Chart Visualization

A beautiful React application built with Tailwind CSS and Recharts for visualizing temperature data across different cities.

## Features

🌡️ **Dynamic Temperature Visualization**
- Real-time temperature updates every 3 seconds
- Smooth line chart animations
- Multiple city support

🏙️ **City Selection**
- Dropdown to select from 5 major cities:
  - Istanbul
  - London
  - New York
  - Tokyo
  - Paris

📊 **Interactive Charts**
- Beautiful line chart with Recharts
- Responsive design
- Tooltips showing exact values
- Custom styling

🎨 pu **Modern UI**
- Tailwind CSS for styling
- Lucide React icons
- Gradient backgrounds
- Card-based layout
- Shadow effects

📈 **Statistics**
- Current temperature display
- Min/Average/Max temperature cards
- Weather icons based on temperature
- Real-time updates

## Technology Stack

- **React** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Usage

1. Select a city from the dropdown menu
2. View the temperature chart updating in real-time
3. Check statistics (Min, Average, Max) below the chart
4. Temperature updates automatically every 3 seconds

## Project Structure

```
temperature-chart/
├── src/
│   ├── App.tsx          # Main component with temperature visualization
│   ├── index.tsx        # React entry point
│   └── index.css        # Tailwind CSS imports
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies
```

## Features Visualization

- **Navigation Bar**: Shows the app title and current selected city
- **City Dropdown**: Select different cities to view their temperature data
- **Current Temperature Card**: Large display of current temperature with weather icon
- **Temperature Chart**: Interactive line chart showing 24-hour forecast
- **Statistics Cards**: Three cards showing Min, Average, and Max temperatures

## Customization

You can easily customize:
- Add more cities by modifying the `citiesData` object
- Change update interval in the `useEffect` hook
- Modify colors and styling in Tailwind classes
- Add more chart features using Recharts components

## License

MIT
