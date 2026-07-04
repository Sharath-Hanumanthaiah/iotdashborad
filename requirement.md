# Project Requirements Document
**Project Name:** IoT Command Center Dashboard
**Document Type:** As-Built Requirement Specification
**Role:** Project Manager / Analyst
**Date:** July 2026

## 1. Executive Summary
This document outlines the functional and non-functional requirements that have been successfully implemented in the initial release of the IoT Command Center Dashboard. The application serves as a data-dense, real-time monitoring interface for an Industrial IoT (IIoT) Smart Factory environment.

## 2. System Architecture
The application is built using a modern decoupled architecture:
*   **Frontend Client:** React-based Single Page Application (SPA) bundled via Vite.
*   **Backend Simulator:** Node.js Express server providing both REST APIs for historical data and a WebSocket server for real-time telemetry streaming.

## 3. Implemented Features

### 3.1. Mock Backend & Data Simulation
*   **Device Fleet Simulation:** Maintains a virtual fleet of 200 IoT devices spanning four factory regions: Assembly (Floor A), Welding (Floor B), Painting (Floor C), and Packaging (Floor D).
*   **Device Types:** Simulates four distinct device profiles: Vibration Sensors, Power Meters, Environmental Gateways, and Edge Gateways.
*   **Real-time Telemetry:** A WebSocket server that pushes live telemetry batches every 2 seconds, alongside real-time KPI metrics and random alert events.
*   **RESTful APIs:** Endpoints to serve historical telemetry data, time-series metrics, paginated table data, and aggregated chart logs.

### 3.2. Application Foundation & Navigation
*   **Design System:** A cohesive, premium dark-mode aesthetic utilizing "glassmorphism" styling, tight padding, and status-based coloring (Green, Red, Amber).
*   **Page Routing:** A static Sidebar navigation menu enabling users to route between different application modules (Dashboard, Devices, Analytics, Alerts, Settings). Non-dashboard views currently render placeholder construction screens.
*   **Global State Management:** Context-driven state management to handle application-wide filters (e.g., Time Range selection: 1H, 6H, 24H, 7D, 30D), WebSocket connection status, and active modal/drawer states.
*   **Top Action Bar:** Displays a live WebSocket connection indicator and provides global time-range filtering controls.

### 3.3. Key Performance Indicators (KPI)
*   **Metric Cards:** Four primary data cards displaying critical fleet metrics:
    *   **Active Devices:** Current online devices vs total devices.
    *   **Success Rate:** Percentage of successful telemetry transmissions.
    *   **Critical Failures:** Count of offline or failing sensors.
    *   **Ingestion Rate:** Current message processing throughput (msg/s).
*   **Trend Indicators:** Each KPI card features a micro-sparkline chart (Canvas-rendered) and a percentage trend indicator.

### 3.4. Data Visualization (Canvas ECharts)
High-performance canvas-based charts utilizing the Apache ECharts library, synchronized via shared tooltips:
*   **Environmental Metrics (Time Series):** Tracks Temperature, Humidity, and Pressure across the selected time horizon.
*   **Message Throughput (Stacked Bar):** Visualizes the volume of successful versus failed messages on an hourly basis.
*   **Fleet Health (Donut/Gauge):** A circular breakdown of the current fleet status (Online, Warning, Critical, Offline).
*   **Device Utilization (Heatmap):** A multi-dimensional grid showing activity levels mapped by region and hour of the day.
*   **Correlation Analysis (Scatter Plot):** Maps individual devices by their remaining Battery Percentage against Signal Strength (RSSI).

### 3.5. Interactive Telemetry Table
*   **Data Grid:** A high-performance, paginated table built with TanStack Table displaying historical and real-time telemetry logs.
*   **Advanced Filtering:** Users can filter logs by Search query, Device Type, Status, and Region.
*   **Table Sorting:** Column-based ascending and descending sorting capabilities.
*   **Progressive Disclosure:** Rows can be expanded inline to reveal the raw JSON telemetry payload and event metadata without navigating away from the list.

### 3.6. Drill-down Context Modals
Implements an "On-Click to Reveal" progressive disclosure pattern across all visual elements:
*   **Timestamp Detail Modal:** Triggered by clicking the Time Series chart; displays detailed environmental readings and a sample of affected devices for a specific timestamp.
*   **Device Profile Modal:** Triggered from the Scatter Plot or Region lists; displays comprehensive hardware specifications (Firmware, IP, Location, Model), live battery/signal health, and a configuration JSON view.
*   **Region Drill-down Modal:** Triggered from the Heatmap; displays aggregated health statistics for a specific factory floor alongside a tabular list of all localized devices.
*   **Side-Drawer Framework:** A reusable off-canvas right drawer system designed to hold contextual information without obstructing the primary dashboard view.

## 4. Non-Functional Requirements (Implemented)
*   **Performance:** Canvas-based rendering utilized for all charts to maintain 60FPS under high-frequency data ingestion.
*   **Resilience:** The WebSocket client implements an exponential backoff reconnection strategy to automatically recover from server disconnects.
*   **Responsiveness:** The layout utilizes CSS Grid and Flexbox to adapt gracefully across wide-screen formats.
