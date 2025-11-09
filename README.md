# HTTP Status Codes Helper

A simple VS Code extension that provides inline completions, hover tooltips, and a command palette search for HTTP status codes.

Stop guessing what `409` means. Stop Googling `201`. Get instant feedback and insert codes quickly.



## 🚀 Features

* **IntelliSense Completions:** Get a full list of status codes with descriptions when you type `status(`, `statusCode:`, `"status":`, or `return `.
* **Hover Tooltips:** Hover over any numeric status code (e.g., `404`, `200`, `503`) in your code to see its name and detailed meaning.
* **Command Palette:** Run the "**HTTP Status: Show All Status Codes**" command (Ctrl+Shift+P) to search all codes and insert the one you need.
* **Lightweight:** Uses a single, local JSON file for data. No network access required.

## Usage

### 1. IntelliSense / Autocompletion

Simply start typing a common pattern for setting a status code. The completion list will automatically appear.

**Example Triggers:**
* `res.status(`
* `return 404` (type `return `)
* `"statusCode": `
* `"status": `

When you select an item (e.g., `201 Created`), only the numeric code (`201`) is inserted.

![IntelliSense Completion Example](https://i.imgur.com/example.gif) ### 2. Hover Information

Hover your mouse over any 3-digit status code in your code to get instant details.

![Hover Tooltip Example](https://i.imgur.com/example.png) > **Hover:**
> **404 Not Found**
>
> The server can not find the requested resource. In an API, this can also mean the endpoint is valid but the resource itself does not exist.

### 3. Command Palette

1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2.  Type "**HTTP Status: Show All Status Codes**".
3.  Search for the code or description you need (e.g., "teapot", "created", "409").
4.  Press Enter to insert the numeric code at your cursor.

## Supported Languages

This extension is automatically activated for the following languages:

* JavaScript (`.js`)
* JavaScript React (`.jsx`)
* TypeScript (`.ts`)
* TypeScript React (`.tsx`)
* Python (`.py`)
* Go (`.go`)
* Java (`.java`)
* JSON (`.json`)

## ⚙️ Extension Settings

You can customize the extension's behavior via your `settings.json` file or the VS Code Settings UI.

* `http-status-helper.enableHoverTooltips`:
    * **Type:** `boolean`
    * **Default:** `true`
    * **Description:** Set to `false` to disable the hover tooltips if they interfere with other extensions.

---

**Enjoy!**