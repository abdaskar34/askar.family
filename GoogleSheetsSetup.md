# 📊 Google Sheets Cloud Database Setup Guide

Follow these steps to connect your Askar Family Prayer Tracker to a shared Google Sheet. This allows all family members to sync and view the same prayer data in real-time.

---

## 🛠️ Step-by-Step Setup

### Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Rename the spreadsheet to something like `Askar Family Prayer Tracker DB`.
3. Set the first sheet (tab) name to **`PrayerRecords`** (This tab name must match exactly).
4. Add the following column headers in the first row:
   * **Column A**: `id`
   * **Column B**: `date`
   * **Column C**: `member`
   * **Column D**: `prayer`
   * **Column E**: `status`
   * **Column F**: `markedTime`
   * **Column G**: `timestamp`
   * **Column H**: `onTime`
   * **Column I**: `note`
   * **Column J**: `updatedAt`
5. Make the first row bold so it is easy to read.

---

### Step 2: Open the Google Apps Script Editor
1. In the Google Sheets menu, click on **Extensions** > **Apps Script**.
2. Erase any code currently inside the editor (usually `myFunction()`).
3. Copy the script code below and paste it into the editor.

---

### Step 3: Google Apps Script Code
```javascript
// --- CONFIGURATION ---
var PASSCODE = "askar12345"; // Match this passcode in your website Settings!
var SHEET_NAME = "PrayerRecords"; // Tab name in your spreadsheet

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  // If sheet is empty or headers are missing, initialize it
  if (data.length === 0 || data[0].length === 0 || data[0].indexOf("id") === -1) {
    initializeSheet(sheet);
    data = sheet.getDataRange().getValues();
  }
  
  var headers = data[0];
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue; // Skip empty rows
    
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      var cellVal = row[j];
      
      // Safe Date formatting for JSON transport
      if (cellVal instanceof Date) {
        if (header === 'date') {
          cellVal = cellVal.getFullYear() + '-' + 
                    String(cellVal.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(cellVal.getDate()).padStart(2, '0');
        } else {
          cellVal = cellVal.toISOString();
        }
      }
      record[header] = cellVal;
    }
    records.push(record);
  }
  
  var response = { status: "success", data: records };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var result = { status: "error", message: "Unknown error" };
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var passcode = payload.passcode;
    
    if (passcode !== PASSCODE) {
      result.message = "Invalid passcode";
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    
    if (action === "save") {
      var record = payload.record;
      saveRecord(sheet, record);
      result = { status: "success", message: "Record saved successfully" };
    } else if (action === "delete") {
      var id = payload.id;
      deleteRecord(sheet, id);
      result = { status: "success", message: "Record deleted successfully" };
    } else if (action === "reset") {
      resetRecords(sheet);
      result = { status: "success", message: "Database reset complete" };
    } else if (action === "import") {
      var records = payload.records;
      importRecords(sheet, records);
      result = { status: "success", message: "Import complete", count: records.length };
    } else {
      result.message = "Invalid action: " + action;
    }
  } catch (err) {
    result.message = err.toString();
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveRecord(sheet, record) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf("id");
  
  if (idIndex === -1) {
    initializeSheet(sheet);
    data = sheet.getDataRange().getValues();
    headers = data[0];
    idIndex = headers.indexOf("id");
  }
  
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex] === record.id) {
      rowIndex = i + 1; // 1-indexed row number
      break;
    }
  }
  
  var rowValues = headers.map(function(h) {
    return record[h] !== undefined ? record[h] : "";
  });
  
  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function deleteRecord(sheet, id) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf("id");
  if (idIndex === -1) return;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function resetRecords(sheet) {
  var numRows = sheet.getLastRow();
  if (numRows > 1) {
    sheet.deleteRows(2, numRows - 1);
  }
}

function importRecords(sheet, records) {
  // Delete existing records first
  resetRecords(sheet);
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  if (headers.indexOf("id") === -1) {
    initializeSheet(sheet);
    data = sheet.getDataRange().getValues();
    headers = data[0];
  }
  
  if (records.length === 0) return;
  
  // Convert records array to grid of values
  var rowsToAppend = records.map(function(record) {
    return headers.map(function(h) {
      return record[h] !== undefined ? record[h] : "";
    });
  });
  
  sheet.getRange(2, 1, rowsToAppend.length, headers.length).setValues(rowsToAppend);
}

function initializeSheet(sheet) {
  sheet.clear();
  var headers = ["id", "date", "member", "prayer", "status", "markedTime", "timestamp", "onTime", "note", "updatedAt"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}
```

---

### Step 4: Deploy the Web App
1. At the top right of the Google Apps Script editor, click on the **Deploy** button and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   * **Description**: `Askar Family Prayer API`
   * **Execute as**: **`Me (your-email@gmail.com)`**
   * **Who has access**: **`Anyone`** (This is crucial, otherwise the website cannot send requests to it).
4. Click **Deploy**.
5. Google will ask you to authorize access. Click **Authorize access**, choose your Google account, click **Advanced**, and then **Go to Untitled project (unsafe)**. Click **Allow**.
6. Copy the **Web app URL** provided in the success window. It should look like this:
   `https://script.google.com/macros/s/XXXXX/exec`

---

### Step 5: Connect the Website
1. Open the Askar Family Prayer Tracker website.
2. Navigate to the **Settings** page.
3. Locate the **Shared Cloud Database** section.
4. Paste your **Web App URL** into the URL field.
5. Enter your **Passcode** (default is `askar12345` unless you changed it in the script code).
6. Click **Save & Connect**.
7. The sync status badge will turn green showing **Connected**, and the app will instantly pull and sync your family records!
