import { AuthService } from './../auth-service/authService';
import { HttpService } from './../http-service/http-service';
import { Injectable } from '@angular/core';
import { appConfig } from './../config/component-config';
import { apiConfig } from './../config/main-config';
import { SwPush } from '@angular/service-worker';


@Injectable({
  providedIn: 'root'
})
export class WebPushNotifyService {
  constructor(
    private swPush: SwPush,
    private http: HttpService
  ) { }

  public publicKey;
  advisorId = AuthService.getAdvisorId();

  enableWebPushNotification() {
    const data = {};
    this.http.get(apiConfig.MAIN_URL + appConfig.GET_WEBPUSH_PUBLIC_KEY, data).subscribe(res => {
      if (res) {
        console.log(res);
        this.publicKey = res;
        if(this.swPush.isEnabled){
          this.swPush.requestSubscription({
            serverPublicKey: this.publicKey
          }).then(sub=> {
            const data = {
              advisorId: this.advisorId,
              json: sub
            }
            this.http.put(apiConfig.MAIN_URL + appConfig.PUT_WEBPUSH_REGISTER_JSON, data)
              .subscribe(res=>{
                if(res){
                  console.log("success",res);
                }
              })
          }).catch(err=> console.error(err))
        }
      }
    });
  }
}
