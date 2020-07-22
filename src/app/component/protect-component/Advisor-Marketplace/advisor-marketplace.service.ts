import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class AdvisorMarketplaceService {

  constructor(private http: HttpService) { }

  getCallDetails(data) { 
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MARKET_PLACE + appConfig.GET_CALL_DETAILS, httpParams);
  }

  addCallDetails(data){ 
    return this.http.put(apiConfig.MARKET_PLACE + appConfig.ADD_CALL_DETAILS, data);
  }

  addCallAvailable(data){
    return this.http.put(apiConfig.MARKET_PLACE + appConfig.ADD_CALL_AVAILABLE, data);
  }
}
