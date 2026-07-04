Project Requirements Document

Project Name: IoT Command Center Dashboard
Document Type: As-Built Requirement Specification
Role: Project Manager / Analyst
Date: July 2026

1. Executive Summary

This document outlines the functional and non-functional requirements that have been successfully implemented in the initial release of the IoT Command Center Dashboard.

The application serves as a data-dense, real-time monitoring interface for an Industrial IoT (IIoT) Smart Factory environment.

2. System Architecture

The application is built using a modern decoupled architecture.

2.1 Frontend Client
React-based Single Page Application (SPA)
Bundled using Vite
2.2 Backend Simulator
Node.js Express server
REST APIs for historical data
WebSocket server for real-time telemetry streaming
3. Implemented Features
3.1 Mock Backend & Data Simulation
Device Fleet Simulation
Maintains a virtual fleet of 200 IoT devices.
Devices are distributed across four factory regions:
Assembly (Floor A)
Welding (Floor B)
Painting (Floor C)
Packaging (Floor D)
Device Types

Simulates four distinct device profiles:

Vibration Sensors
Power Meters
Environmental Gateways
Edge Gateways
Real-time Telemetry
WebSocket server pushes live telemetry batches every 2 seconds.
Streams real-time KPI metrics.
Generates random alert events.
RESTful APIs

Provides endpoints for:

Historical telemetry data
Time-series metrics
Paginated table data
Aggregated chart logs
3.2 Application Foundation & Navigation
Design System
Premium dark-mode interface
Glassmorphism styling
Tight spacing and padding
Status-based colors:
Green
Red
Amber
Page Routing

Static sidebar navigation provides routing for:

Dashboard
Devices
Analytics
Alerts
Settings

Non-dashboard pages currently display placeholder construction screens.

Global State Management

Context-driven state management for:

Global time range filters
1H
6H
24H
7D
30D
WebSocket connection status
Active modal states
Drawer states
Top Action Bar

Displays:

Live WebSocket connection indicator
Global time-range filter controls
3.3 Key Performance Indicators (KPI)
Metric Cards

Four KPI cards display:

Active Devices
Current online devices versus total devices
Success Rate
Percentage of successful telemetry transmissions
Critical Failures
Count of offline or failing sensors
Ingestion Rate
Current message processing throughput (msg/s)
Trend Indicators

Each KPI card includes:

Canvas-rendered micro sparkline
Percentage trend indicator
3.4 Data Visualization (Canvas ECharts)

High-performance canvas-based visualizations using Apache ECharts with synchronized shared tooltips.

Environmental Metrics (Time Series)

Tracks:

Temperature
Humidity
Pressure

Across the selected time horizon.

Message Throughput (Stacked Bar)

Displays:

Successful messages
Failed messages

On an hourly basis.

Fleet Health (Donut/Gauge)

Breakdown of fleet status:

Online
Warning
Critical
Offline
Device Utilization (Heatmap)

Shows activity levels by:

Factory region
Hour of the day
Correlation Analysis (Scatter Plot)

Plots devices using:

Remaining Battery Percentage
Signal Strength (RSSI)
3.5 Interactive Telemetry Table
Data Grid
High-performance paginated table
Built using TanStack Table
Displays historical and real-time telemetry logs
Advanced Filtering

Supports filtering by:

Search query
Device Type
Status
Region
Table Sorting
Ascending sorting
Descending sorting
Progressive Disclosure

Expandable rows reveal:

Raw JSON telemetry payload
Event metadata

Without leaving the current view.

3.6 Drill-down Context Modals

Implements an "On-Click to Reveal" progressive disclosure pattern across dashboard visualizations.

Timestamp Detail Modal

Triggered from:

Time Series chart

Displays:

Environmental readings
Sample affected devices
Selected timestamp details
Device Profile Modal

Triggered from:

Scatter Plot
Region lists

Displays:

Firmware
IP Address
Location
Model
Live battery status
Signal health
Configuration JSON
Region Drill-down Modal

Triggered from:

Heatmap

Displays:

Aggregated health statistics
Device list for the selected factory floor
Side-Drawer Framework

Reusable off-canvas right-side drawer for contextual information without obstructing the primary dashboard.

4. Non-Functional Requirements (Implemented)
Performance
Canvas-based rendering for all charts.
Maintains 60 FPS during high-frequency data ingestion.
Resilience
WebSocket client implements exponential backoff reconnection.
Automatically recovers from server disconnects.
Responsiveness
Layout built using CSS Grid and Flexbox.
Adapts across wide-screen formats.