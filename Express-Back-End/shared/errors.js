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

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError",
      this.errorMessage = message,
      this.errorCode = 'GNR-0001',
      this.status = 400
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError",
      this.errorMessage = message,
      this.errorCode = 'USR-0001',
      this.status = 401
  }
}

class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError",
      this.errorMessage = message,
      this.errorCode = 'DB-0003',
      this.status = 400
  }
}

class UnknownError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError",
      this.errorMessage = message,
      this.errorCode = 'SYS-0004',
      this.status = 500
  }
}

module.exports = {
  DatabaseError,
  RecordNotFoundError,
  GeneratePdfError,
  HandlebarCompileError,
  BrowserLaunchError,
  ValidationError,
  AuthenticationError,
  UserNotFoundError,
  UnknownError
}