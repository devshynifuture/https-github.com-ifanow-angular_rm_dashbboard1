import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { AuthService } from '../auth-service/authService';

const Buffer = require('buffer/').Buffer;
declare var require: any;
const DEFAULT_AGE = 10000;
export class CacheEntry {
  url: string;
  request: string;
  response: HttpResponse<any>;
  exitTime: number;
}

@Injectable()

export class HttpService {

  authToken: any = '';
  private baseUrl = '';
  cacheMap = new Map<string, CacheEntry>();

  constructor(private _http: HttpClient, private _userService: AuthService, private _router: Router) {
    this.authToken = this._userService.getToken();
  }

  post(url: string, body, options?): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json')
    };
    if (options != undefined) {
      httpOptions = options;
    }
    return this._http
      .post(this.baseUrl + url, body, httpOptions)
      .map((res:any) => {
        if (res['status'] === 'AUTH_TOKEN_EXPIRED') {
          window.alert('Invalid user, please login');
          this._router.navigate(['login']);
        } else {
          return res;
        }
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  put(url: string, body, options?): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json')
    };
    if (options != undefined) {
      httpOptions = options;
    }
    return this._http
      .put(this.baseUrl + url, body, httpOptions)
      .map((res:any) => {
        if (res['status'] === 'AUTH_TOKEN_EXPIRED') {
          window.alert('Invalid user, please login');
          this._router.navigate(['login']);
        } else {
          return res;
        }
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  deleteExpiredCache() {
    this.cacheMap.forEach(entry => {
      if (entry.exitTime < Date.now()) {
        this.cacheMap.delete(entry.url);
      }
    });
  }





  getEncoded(url: string, params, requestAge: number): Observable<any> {
    if (!requestAge) {
      requestAge = DEFAULT_AGE;
    }
    const objJson64 = this.changeBase64Data(params);
    const entry = this.cacheMap.get(url);
    if (entry) {
      const isExpired = entry.exitTime < Date.now();
      if (isExpired) {
        this.deleteExpiredCache();
      } else if (entry.request === objJson64) {
        return Observable.of((entry.response));
      }
    }
    console.log(objJson64);
    let httpParams = new HttpParams();
    httpParams = httpParams.append('query', objJson64);
    const httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json'),
      params: httpParams
    };
    url = url.trim();
    return this._http
      .get(this.baseUrl + url, httpOptions)
      .map((res: any) => {
        if (res['status'] === 'AUTH_TOKEN_EXPIRED') {
          window.alert('Invalid user, please login');
          this._router.navigate(['login']);
        } else {
          const cache = new CacheEntry();
          cache.exitTime = Date.now() + requestAge;
          cache.request = objJson64;
          cache.url = url;
          this.cacheMap.set(url, cache);
          return res;
        }
      });
  }



  // getMethod(url: string, params): Observable<any> {
  //   let httpParams = new HttpParams();
  //   const httpOptions = {
  //     headers: new HttpHeaders().set('authToken', this._userService.getToken())
  //       .set('Content-Type', 'application/json'),
  //        params: params
  //   };
  //   url = url.trim();
  //   return this._http
  //     .get(this.baseUrl + url, httpOptions)
  //     .map((res: any) => {
  //       if (res['status'] === 'AUTH_TOKEN_EXPIRED') {
  //         window.alert('Invalid user, please login');
  //         this._router.navigate(['login']);
  //       } 
  //     });
  // }






  //------------------------Aman jain code date 22 aug ------------------------------------------------------

  get(url: string, params): Observable<any> {
  
    const httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json'),
        params
    };
    url = url.trim();
    return this._http
      .get(this.baseUrl + url, httpOptions)
      .map((res: any) => {
        console.log(res)

        if (res.status === 200) {
          let resData = this.changeBase64ToString(res);
          console.log(resData)
          return resData;
        }
        else {
          this._router.navigate(['login']);
        }
      });
  }

  changeBase64Data(params): string {
    const objJsonStr = JSON.stringify(params);
    console.log(objJsonStr);
    const objJsonB64 = Buffer.from(objJsonStr).toString('base64');
    return objJsonB64;
  }

  changeBase64ToString(res) {
    let encodedata = res.payLoad;
    let datavalue = (Buffer.from(encodedata, 'base64').toString('ascii'));
    let responseData = JSON.parse(datavalue);
    return responseData;
  }
  //----------------------- End  getmethod url  Code ------------------------------------------------------



















  //    delete(url:string, params?){
  //      let httpOptions = {
  //        headers: new HttpHeaders().set('authToken', this._userService.getToken())
  //        .set('Content-Type', 'application/json')
  //      };
  //      if(params){
  //        httpOptions["params"] = params;
  //      }
  //      return this._http.delete( ${environment.carNationUrl} + url, httpOptions)
  //                  .map((res: ArrayBuffer) => {
  //                    if(res['status'] == 'AUTH_TOKEN_EXPIRED'){
  //                      window.alert("Invalid user, please login");
  //                      this._router.navigate(['login']);
  //                    }else{
  //                      return res;
  //                    }
  //                  })
  //                  .catch((err)=>{
  //                    return Observable.throw(err);
  //                  });
  //    }
  //    login(url:string, body, options?){
  //      let httpOptions = {
  //        headers: new HttpHeaders()
  //        .set('Content-Type', 'application/json')
  //      };
  //      if(options != undefined){
  //        httpOptions = options
  //      }
  //      return this._http
  //        .post(${environment.userLogin} , body, httpOptions)
  //        .map((res: ArrayBuffer) => res);
  //    }

  getBaseUrl() {
    return this.baseUrl;
  }
}
