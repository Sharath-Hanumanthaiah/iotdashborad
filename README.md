# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.




# 3.5 Historical Telemetry Analytics

### Historical Telemetry Table

* High-performance paginated table built using TanStack Table.
* Displays historical telemetry records retrieved from REST APIs.
* Supports efficient browsing of large telemetry datasets.

### Data Exploration

Users can explore historical telemetry using:

* Search query
* Device Type
* Device Status
* Factory Region

### API Access

Historical telemetry data is retrieved through RESTful APIs that provide:

* Paginated telemetry records
* Filtered datasets
* Historical device information
* Time-based telemetry logs

### Table Sorting

Supports:

* Ascending sorting
* Descending sorting

Across supported table columns.

### Expandable Telemetry Details

Each telemetry record can be expanded inline to display:

* Complete raw JSON telemetry payload
* Event metadata
* Device information
* Timestamp details

Without navigating away from the current table.

---

## 3.6 Contextual Drill-Down Framework

Implements a reusable "On-Click to Reveal" contextual exploration framework across dashboard visualizations.

### Timestamp Detail Modal

Triggered by:

* Time Series Chart

Displays:

* Environmental readings for the selected timestamp
* Related device samples
* Associated telemetry information

### Device Profile Modal

Triggered by:

* Correlation Scatter Plot
* Region device lists

Displays:

* Device hardware specifications
* Firmware version
* Device model
* IP Address
* Physical location
* Live battery health
* Signal strength
* Configuration JSON

### Region Analytics Modal

Triggered by:

* Device Utilization Heatmap

Displays:

* Regional fleet health summary
* Aggregated statistics
* Device inventory for the selected factory region

### Side Drawer Framework

A reusable right-side contextual drawer used to present additional information while keeping the primary dashboard visible. It provides a consistent framework for displaying detailed analytics, telemetry information, and drill-down content across the application.

