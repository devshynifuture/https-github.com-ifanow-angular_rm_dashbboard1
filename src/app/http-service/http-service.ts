import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
// import 'rxjs/Rx';
import { AuthService } from '../auth-service/authService';
import 'rxjs-compat/add/observable/of';
import 'rxjs-compat/add/operator/map';
import { catchError } from 'rxjs/operators';
import { EmailUtilService } from '../services/email-util.service';

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
      .post(this.baseUrl + url, body, httpOptions).pipe(
        catchError(err => of([]))

        // catchError(err => {
        //   console.log('Handling error locally and rethrowing it...', err);
        //
        //   // return throwError(err);
        // })
      )
      .map((res: any) => {
        if (res.status === 200 || res.status === 201) {
          // console.log('resData: decoded ', res);

          const resData = this.changeBase64ToString(res);
          console.log('resData: decoded ', resData);
          return resData;
        } else {

          // this._router.navigate(['login']);
          throw new Error(res.message);
        }
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
    // console.log('HttpService put request httpOptions... ', httpOptions);
    // console.log('HttpService put request body... ', body);
    // console.log('HttpService put request url... ', url);

    return this._http
      .put(this.baseUrl + url, body, httpOptions).pipe(
        catchError(err => {
          console.log('Handling error locally and rethrowing it...', err);
          return throwError(err);
        })
      )
      .map((res: any) => {
        if (res.status === 200) {
          const resData = this.changeBase64ToString(res);
          console.log(resData);
          return resData;
        } else {
          const err = new Error(res.message);
          throwError(err);

          // this._router.navigate(['login']);
        }
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
      .get(this.baseUrl + url, httpOptions).pipe(
        catchError(err => {
          console.log('Handling error locally and rethrowing it...', err);
          return throwError(err);
        })
      )
      .map((res: any) => {
        if (res.status === 'AUTH_TOKEN_EXPIRED') {
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


  // ------------------------Aman jain code date 22 aug ------------------------------------------------------

  get(url: string, params): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json'),
      params
    };
    url = url.trim();
    return this._http
      .get(this.baseUrl + url, httpOptions).pipe(
        catchError(err => {
          console.log('Handling error locally and rethrowing it...', err);
          return throwError(err);
        })
      )
      .map((res: any) => {
        console.log(res);

        if (res.status === 200) {
          const resData = this.changeBase64ToString(res);
          console.log('decoded resData', resData);
          return resData;
        } else {
          // this._router.navigate(['login']);
          return;
        }
      });
  }

  // created by sarvesh

  changeBase64Data(params): string {
    const objJsonStr = JSON.stringify(params);
    console.log(objJsonStr);
    const objJsonB64 = Buffer.from(objJsonStr).toString('base64');
    return objJsonB64;
  }

  changeBase64ToString(res) {
    const encodedata = res.payLoad;
    try {
      const datavalue = (Buffer.from(encodedata, 'base64').toString('ascii'));
      console.log('datavalue: ', datavalue);
      // console.log('encodedata: ', encodedata);

      try {
        const responseData = JSON.parse(datavalue);
        return responseData;

      } catch (e) {
        console.error('JSON parse error e : ', e);
        return JSON.parse(EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(encodedata));
      }
    }
    catch (e) {
      console.error(e);
      return encodedata;
    }
  }

  // ----------------------- End  getmethod url  Code ------------------------------------------------------

  postExternal(url: string, body, options?): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    if (options != undefined) {
      httpOptions = options;
    }
    console.log('HttpService postExternal options : ', options);
    return this._http
      .post(url, body, httpOptions).pipe(
        catchError(err => of([]))

        // catchError(err => {
        //   console.log('Handling error locally and rethrowing it...', err);
        //
        //   // return throwError(err);
        // })
      );
  }


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
