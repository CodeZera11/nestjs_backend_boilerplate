export class SuccessResponse {
  statusCode: number;
  data: any;
  message: string;

  constructor(
    data: any,
    message = 'The request was successful',
    statusCode = 200,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}
