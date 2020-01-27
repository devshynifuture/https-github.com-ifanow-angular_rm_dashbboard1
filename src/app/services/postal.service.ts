import { Injectable } from '@angular/core';
import { EventService } from '../Data-service/event.service';
import { apiConfig } from 'src/app/config/main-config';
import { HttpService } from 'src/app/http-service/http-service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PostalService {

  constructor(private eventService: EventService, private http: HttpService) { }

  getPostalPin(value: any) {
    // return this.http.get(apiConfig.POSTAL_URL + '', value);
    const fileuploadurl = 'https://api.postalpincode.in/pincode/'+value;  
    return this.http.getHttpClient(fileuploadurl);
  }


}
