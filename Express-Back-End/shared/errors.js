'use strict';

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError",
    this.errorMessage = message,
    this.errorCode = 'DB-0001',
    this.status = 400
  }
}

class RecordNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError",
      this.errorMessage = message,
      this.errorCode = 'DB-0002',
      this.status = 400
  }
}

class GeneratePdfError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeneratePdfError",
    this.errorMessage = message,
    this.errorCode = 'SYS-0001',
    this.status = 400
  }
}

class HandlebarCompileError extends Error {
  constructor(message) {
    super(message);
    this.name = "HandlebarCompileError",
    this.errorMessage = message,
    this.errorCode = 'SYS-0002',
    this.status = 400
  }
}

class BrowserLaunchError extends Error {
  constructor(message) {
    super(message);
    this.name = "BrowserLaunchError",
    this.errorMessage = message,
    this.errorCode = 'SYS-0003',
    this.status = 400
  }
}

module.exports = {
  DatabaseError,
  RecordNotFoundError,
  GeneratePdfError,
  HandlebarCompileError,
  BrowserLaunchError
}