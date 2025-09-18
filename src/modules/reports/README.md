# API Documentation for Reports Module

## Overview

This document outlines the API endpoints needed to support the Reports functionality in the Finance Management application.

## Endpoints Required

### 1. Transaction Reports

#### GET /api/reports/transactions

Get transactions within a date range, optionally filtered by wallet.

**Query Parameters:**

- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format
- `walletId` (optional): Filter by specific wallet ID
- `type` (optional): Filter by transaction type (INCOME/EXPENSE)

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "date": "2024-01-15",
        "amount": 500000,
        "description": "Mua sắm tạp hóa",
        "walletName": "Ví Tiết Kiệm",
        "walletId": 1,
        "type": "EXPENSE",
        "currency": "VND",
        "category": "Food & Dining"
      }
    ],
    "summary": {
      "totalIncome": 2000000,
      "totalExpense": 700000,
      "netAmount": 1300000
    }
  }
}
```

#### GET /api/reports/transactions/today

Get today's transactions.

**Query Parameters:**

- `walletId` (optional): Filter by specific wallet ID

**Response:** Same as above

### 2. Budget Reports

#### GET /api/reports/budgets/{month}

Get budget statistics for a specific month.

**Path Parameters:**

- `month`: Month in YYYY-MM format

**Response:**

```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "budgets": [
      {
        "id": 1,
        "category": "Ăn uống",
        "budgetAmount": 2000000,
        "usedAmount": 1200000,
        "remainingAmount": 800000,
        "currency": "VND",
        "transactions": [
          {
            "id": 1,
            "date": "2024-01-15",
            "amount": 500000,
            "description": "Mua sắm tạp hóa"
          }
        ]
      }
    ]
  }
}
```

### 3. Export Functionality

#### POST /api/reports/export

Export transaction data to Excel or PDF.

**Request Body:**

```json
{
  "format": "excel", // or "pdf"
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "walletId": null, // optional
  "title": "Transaction Report"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://api.example.com/downloads/report-123.xlsx",
    "fileName": "transaction-report-2024-01.xlsx",
    "expiresAt": "2024-01-16T10:00:00Z"
  }
}
```

### 4. Email Reports

#### POST /api/reports/email/schedule

Schedule automatic email reports.

**Request Body:**

```json
{
  "frequency": "daily", // daily, weekly, monthly
  "email": "user@example.com",
  "enabled": true,
  "walletIds": [1, 2], // optional, all wallets if null
  "includeCharts": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scheduleId": 123,
    "message": "Email report scheduled successfully"
  }
}
```

#### GET /api/reports/email/settings

Get current email report settings.

**Response:**

```json
{
  "success": true,
  "data": {
    "daily": {
      "enabled": true,
      "email": "user@example.com",
      "lastSent": "2024-01-15T08:00:00Z"
    },
    "weekly": {
      "enabled": false,
      "email": null,
      "lastSent": null
    },
    "monthly": {
      "enabled": true,
      "email": "user@example.com",
      "lastSent": "2024-01-01T08:00:00Z"
    }
  }
}
```

#### POST /api/reports/email/send-now

Send a report email immediately.

**Request Body:**

```json
{
  "type": "summary", // summary, detailed
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "email": "user@example.com"
}
```

### 5. Dashboard Statistics

#### GET /api/reports/dashboard/summary

Get summary statistics for dashboard.

**Query Parameters:**

- `period` (optional): today, week, month, year (default: month)

**Response:**

```json
{
  "success": true,
  "data": {
    "totalIncome": 5000000,
    "totalExpense": 3200000,
    "netAmount": 1800000,
    "transactionCount": 45,
    "topCategories": [
      {
        "category": "Food & Dining",
        "amount": 800000,
        "percentage": 25
      }
    ]
  }
}
```

## Implementation Notes

### Frontend Services

Create these service files:

1. `src/modules/reports/services/reportService.js`
2. `src/modules/reports/services/exportService.js`
3. `src/modules/reports/services/emailService.js`

### Backend Requirements

1. File generation libraries (Excel.js, PDF-lib, etc.)
2. Email service integration (SendGrid, AWS SES, etc.)
3. File storage for temporary exports (AWS S3, local storage)
4. Scheduled job system for automatic emails
5. Data aggregation queries for efficient reporting

### Security Considerations

1. Rate limiting on export endpoints
2. File access token validation
3. Email validation and sanitization
4. User authorization for accessing reports
5. Temporary file cleanup

### Performance Optimization

1. Database indexing on date and wallet columns
2. Caching for frequently accessed reports
3. Pagination for large datasets
4. Background processing for large exports
5. CDN for file downloads
