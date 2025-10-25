# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2024-12-19

### Added
- Auto-scaling trend charts for better visibility
- GPU temperature cache (5 second interval)
- Optimized memory usage

### Changed
- Chart data points reduced from 60 to 30 (50% less memory)
- GPU temperature updates every 5 seconds instead of every second
- All trend charts now use auto-scaling Y-axis
- Reduced PowerShell command timeouts for faster responses

### Performance Improvements
- Backend CPU usage reduced by ~30% (cache implementation)
- Frontend memory usage reduced by ~15% (fewer data points)
- Faster API responses due to reduced timeout values
- Better resource efficiency overall

## [1.0.0] - 2024-12-19

### Added
- Real-time CPU and Memory monitoring dashboard
- GPU temperature monitoring with trend chart
- Network activity monitoring (Upload/Download with percentage scales)
- Interactive 60-second trend charts for CPU, Memory, and GPU
- Process list showing top 50 processes by CPU usage
- Beautiful modern UI with Tailwind CSS
- Responsive design for all screen sizes
- Auto-refresh every 1 second (1 FPS) for optimal performance
- Backend API server on port 9191
- Frontend React app on port 3000
- Windows batch files for easy start/stop (start.bat, stop.bat)
- GPU temperature detection for NVIDIA, AMD, and generic GPUs

### Changed
- Updated project name from "temperature-chart" to "cpu-and-mem"
- Optimized performance with minimal resource usage
- Chart animations disabled for smoother experience
- Network scales: Upload max 5 MB/s, Download max 60 MB/s

### Technical Details
- Backend: Node.js + Express + SystemInformation
- Frontend: React + TypeScript + Tailwind CSS + Recharts
- CPU Usage: Real-time percentage and trend graph
- Memory Usage: Real-time GB usage and percentage
- GPU Temperature: Real-time °C monitoring with 60-second trend
- Network: Upload/Download speeds with percentage indicators
- Processes: Top processes sorted by CPU usage

### Resource Usage
- Backend: ~5.5% CPU, ~70 MB RAM
- Frontend: ~20% CPU, ~422 MB RAM
- Total: ~26% CPU, ~492 MB RAM

### Performance Optimizations
- 1 FPS update rate (optimal for dashboard)
- No chart animations (reduces CPU usage)
- Efficient data rendering
- Smooth transitions without performance impact

