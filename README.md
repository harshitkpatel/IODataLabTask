# 📊 Report Management System (React + TanStack Table + Tailwind CSS)

This project is a **Report Management System** built with modern React, featuring:

* 🔍 Real-time debounced search
* 🧾 CSV export of filtered and sorted data
* 🗃️ Dynamic filtering (status, department, priority, date)
* 📄 Paginated, sortable data table using **TanStack Table v8**
* 🎨 Fully responsive UI with **Tailwind CSS v4**
* 🔁 Mock API with realistic pagination and filtering

---

## 🚀 Features

### ✅ Real-time Search with Debouncing

* As the user types, API calls are debounced (300ms)
* Search integrates with existing filters
* No API calls when search input is empty
* Visual loading indicator during search

### ✅ CSV Export (Bonus)

* One-click export of filtered and sorted reports
* Includes all columns: ID, Title, Status, Department, Priority, Author, Created Date, Updated Date
* Proper CSV formatting with quoted/escaped values
* Descriptive file naming (e.g., `reports-2025-07-04.csv`)

---

## 🧠 Tech Stack

* **React 19**
* **TanStack Table v8**
* **Tailwind CSS v4**
* **Custom React Hooks**
* **Mock API service**

---

## 🗂 Project Structure

```bash
src/
├── components/
│   ├── DataTable.jsx       # Table rendering with pagination & sorting
│   └── FiltersForm.jsx     # Filter UI + export
├── hooks/
│   ├── useReportsData.js   # Main data-fetching logic
│   └── useDebounce.js      # Custom debounce hook
├── services/
│   └── reportsAPI.js       # Mock API handler
├── utils/
│   └── csvExport.js        # CSV export utility
├── App.jsx                 # Root application
└── index.css               # Tailwind base styles
```

---

## 📦 Installation

```bash
git clone https://github.com/your-repo/report-management-system.git
cd report-management-system
npm install
npm run dev
```

## 📁 Export Example

Example downloaded file: `reports-2025-07-04.csv`

```
ID,Title,Status,Department,Priority,Author,Created Date,Updated Date
1,Quarterly Sales,published,Sales,High,John Doe,2025-06-20,2025-07-01
2,Marketing Plan Q3,pending,Marketing,Medium,Jane Smith,2025-06-10,2025-07-02
```

---

## 👨‍💻 Author

* Developed by Harshit as part of a React Developer Assessment

---

## 📄 License

This project is for assessment/demo purposes only. Not licensed for production.
"# IODataLabTask" 
