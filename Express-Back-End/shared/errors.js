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

module.exports = {
  DatabaseError,
  RecordNotFoundError
}