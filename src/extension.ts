"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

var init = false;
var hasCpp = false;

// let fs = require("fs");
import { window, commands, ExtensionContext, Disposable } from "vscode";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  if (!init) {
    init = true;

    commands.getCommands().then(function (value) {
      let result = value.indexOf("C_Cpp.SwitchHeaderSource");
      if (result >= 0) {
        hasCpp = true;
      }
    });
  }

  console.log("extension is now active!");

  // Step: If simple commands then add to this array
  let commandArray = [
    //=> ["name in package.json" , "name of command to execute"]

    ["ShortcutMenuBar.save", "workbench.action.files.save"],
    [
      "ShortcutMenuBar.toggleTerminal",
      "workbench.action.terminal.toggleTerminal",
    ],
    [
      "ShortcutMenuBar.toggleActivityBar",
      "workbench.action.toggleActivityBarVisibility",
    ],
    ["ShortcutMenuBar.navigateBack", "workbench.action.navigateBack"],
    ["ShortcutMenuBar.navigateForward", "workbench.action.navigateForward"],
    [
      "ShortcutMenuBar.toggleRenderWhitespace",
      "editor.action.toggleRenderWhitespace",
    ],
    ["ShortcutMenuBar.quickOpen", "workbench.action.quickOpen"],
    ["ShortcutMenuBar.findReplace", "editor.action.startFindReplaceAction"],
    ["ShortcutMenuBar.undo", "undo"],
    ["ShortcutMenuBar.redo", "redo"],
    ["ShortcutMenuBar.commentLine", "editor.action.commentLine"],
    ["ShortcutMenuBar.saveAll", "workbench.action.files.saveAll"],
    ["ShortcutMenuBar.openFile", "workbench.action.files.openFile"],
    ["ShortcutMenuBar.newFile", "workbench.action.files.newUntitledFile"],
    ["ShortcutMenuBar.goToDefinition", "editor.action.revealDefinition"],
    ["ShortcutMenuBar.cut", "editor.action.clipboardCutAction"],
    ["ShortcutMenuBar.copy", "editor.action.clipboardCopyAction"],
    ["ShortcutMenuBar.paste", "editor.action.clipboardPasteAction"],
    [
      "ShortcutMenuBar.compareWithSaved",
      "workbench.files.action.compareWithSaved",
    ],
    ["ShortcutMenuBar.showCommands", "workbench.action.showCommands"],
    ["ShortcutMenuBar.startDebugging", "workbench.action.debug.start"],
    ["ShortcutMenuBar.codeFold", "editor.foldAll"],
    ["ShortcutMenuBar.codeUnfold", "editor.unfoldAll"],
  ];

  let disposableCommandsArray: Disposable[] = [];
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  commandArray.forEach((command) => {
    disposableCommandsArray.push(
      commands.registerCommand(command[0], () => {
        commands.executeCommand(command[1]).then(function () {});
      })
    );
  });

  // Step: else add complex command separately

  let disposableBeautify = commands.registerCommand(
    "ShortcutMenuBar.beautify",
    () => {
      let editor = window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      if (window.state.focused === true && !editor.selection.isEmpty) {
        commands
          .executeCommand("editor.action.formatSelection")
          .then(function () {});
      } else {
        commands
          .executeCommand("editor.action.formatDocument")
          .then(function () {});
      }
    }
  );

  let disposableFormatWith = commands.registerCommand(
    "ShortcutMenuBar.formatWith",
    () => {
      let editor = window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      if (window.state.focused === true && !editor.selection.isEmpty) {
        commands
          .executeCommand("editor.action.formatSelection.multiple")
          .then(function () {});
      } else {
        commands
          .executeCommand("editor.action.formatDocument.multiple")
          .then(function () {});
      }
    }
  );

  // see opened files list
  let disposableFileList = commands.registerCommand(
    "ShortcutMenuBar.openFilesList",
    () => {
      let editor = window.activeTextEditor;
      if (!editor || !editor.viewColumn) {
        return; // No open text editor
      }
      commands
        .executeCommand("workbench.action.showAllEditorsByMostRecentlyUsed")
        .then(function () {});
    }
  );

  let disposableSwitch = commands.registerCommand(
    "ShortcutMenuBar.switchHeaderSource",
    () => {
      if (hasCpp) {
        commands
          .executeCommand("C_Cpp.SwitchHeaderSource")
          .then(function () {});
      } else {
        window.showErrorMessage(
          "C/C++ extension (ms-vscode.cpptools) is not installed!"
        );
      }
    }
  );

  // Adding 1) to a list of disposables which are disposed when this extension is deactivated

  disposableCommandsArray.forEach((i) => {
    context.subscriptions.push(i);
  });

  // Adding 2) to a list of disposables which are disposed when this extension is deactivated

  context.subscriptions.push(disposableFileList);
  context.subscriptions.push(disposableBeautify);
  context.subscriptions.push(disposableFormatWith);
  context.subscriptions.push(disposableSwitch);

  //also update button in package.json.. see "Adding new buttons" in help.md file
}

// this method is called when your extension is deactivated
export function deactivate() {}
