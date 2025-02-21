import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  url = "http://localhost:5000"
  // url = "https://smart-contract-api.onrender.com"

  constructor(
    private httpClient: HttpClient
  ) { }

  getPostRequest(url: string, body: any) {
    return this.httpClient.post(this.url + url, body)
  }

  getGetRequest(url: string) {
    return this.httpClient.get(this.url + url)
  }
}
