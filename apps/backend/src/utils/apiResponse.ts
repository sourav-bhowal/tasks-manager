// Purpose: Define the structure of the API response.
class apiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  
  constructor(statusCode: number, data: any, message: string = "Successfull") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default apiResponse;
