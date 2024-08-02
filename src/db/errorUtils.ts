export class SQLDeleteHasQueryError extends Error {
  constructor() {
    super(
      "Delete should have a query to prevent accidental deletion of all records"
    );
  }
}
