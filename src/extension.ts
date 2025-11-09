import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Define the structure of our status code data
interface HttpStatusCode {
  code: number;
  name: string;
  description: string;
}

// Global variable to hold the loaded status codes
let statusCodes: HttpStatusCode[] = [];

// Languages to activate for
const LANGUAGE_SELECTOR = ['javascript', 'typescript', 'python', 'json', 'go', 'java', 'javascriptreact', 'typescriptreact'];

// Regex to trigger completions (e.g., status(, "statusCode":, return )
const COMPLETION_TRIGGER_REGEX = /(status\(|statusCode:|"status":|return\s*)$/i;

// Regex to find status codes for hover
const HOVER_REGEX = /\b([1-5]\d{2})\b/;

/**
 * Main activation function called by VS Code
 */
export function activate(context: vscode.ExtensionContext) {
  // 1. Load the status code data from JSON
  loadStatusCodes(context);

  // 2. Register the Completion Item Provider
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    LANGUAGE_SELECTOR,
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        // Get the text on the line before the cursor
        const linePrefix = document.lineAt(position).text.substring(0, position.character);

        // Check if the prefix matches our trigger regex
        if (!COMPLETION_TRIGGER_REGEX.test(linePrefix)) {
          return undefined; // Not a trigger, don't show completions
        }

        // Create and return the list of completion items
        return statusCodes.map(status => {
          const completionItem = new vscode.CompletionItem(
            `${status.code} ${status.name}`,
            vscode.CompletionItemKind.Constant
          );
          
          // The text to insert when selected
          completionItem.insertText = status.code.toString();
          
          // The detail shown in the completion list
          completionItem.detail = status.description;
          
          // Documentation for the (i) icon
          completionItem.documentation = new vscode.MarkdownString(
            `**${status.code} ${status.name}**\n\n${status.description}`
          );
          
          return completionItem;
        });
      }
    },
    '(', ':', ' ' // Trigger characters
  );

  // 3. Register the Hover Provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    LANGUAGE_SELECTOR,
    {
      provideHover(document, position, token) {
        // Check if hover tooltips are enabled in settings
        const config = vscode.workspace.getConfiguration('http-status-helper');
        if (!config.get('enableHoverTooltips', true)) {
          return undefined;
        }

        // Get the word range at the current position using our regex
        const range = document.getWordRangeAtPosition(position, HOVER_REGEX);
        if (!range) {
          return undefined;
        }

        // Get the text (the status code)
        const word = document.getText(range);
        const code = parseInt(word, 10);

        // Find the matching status code from our data
        const status = statusCodes.find(s => s.code === code);
        if (!status) {
          return undefined;
        }

        // Create the Markdown string for the hover
        const markdownString = new vscode.MarkdownString();
        markdownString.appendMarkdown(`**${status.code} ${status.name}**\n\n`);
        markdownString.appendMarkdown(status.description);

        return new vscode.Hover(markdownString, range);
      }
    }
  );

  // 4. Register the Command Palette command
  const command = vscode.commands.registerCommand('http-status-helper.showStatusCodes', () => {
    // Create a QuickPick item for each status code
    const quickPickItems = statusCodes.map(status => ({
      label: `$(symbol-constant) ${status.code} ${status.name}`,
      description: status.description,
      code: status.code.toString() // Custom property to store the code
    }));

    // Show the QuickPick list
    vscode.window.showQuickPick(quickPickItems, {
      placeHolder: 'Select an HTTP status code to insert',
      matchOnDescription: true
    }).then(selectedItem => {
      if (selectedItem) {
        // Get the active editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          // Insert the selected code at the cursor position
          editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, selectedItem.code);
          });
        }
      }
    });
  });

  // Add all disposables to the context
  context.subscriptions.push(completionProvider, hoverProvider, command);
}

/**
 * Loads and parses the statusCodes.json file
 */
function loadStatusCodes(context: vscode.ExtensionContext) {
  try {
    const dataPath = path.join(context.extensionPath, 'data', 'statusCodes.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    statusCodes = JSON.parse(data);
  } catch (err) {
    console.error('Failed to load HTTP status codes:', err);
    vscode.window.showErrorMessage('HTTP Status Helper: Could not load status codes file.');
    statusCodes = [];
  }
}

// This function is called when your extension is deactivated
export function deactivate() {}