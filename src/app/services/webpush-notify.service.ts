import { HttpService } from './../http-service/http-service';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { appConfig } from './../config/component-config';
import { apiConfig } from './../config/main-config';


@Injectable({
  providedIn: 'root'
})
export class WebPushNotifyService {
  constructor(
    private swPush: SwPush,
    private http: HttpService

  ) { }

  private publicKey;

  getVapidKey() {
    const data = {};
    this.http.get(apiConfig.MAIN_URL + appConfig.GET_WEBPUSH_PUBLIC_KEY, data).subscribe(res => {
      if (res) {
        console.log(res);
        this.publicKey = res;
      }
    });
  }
}