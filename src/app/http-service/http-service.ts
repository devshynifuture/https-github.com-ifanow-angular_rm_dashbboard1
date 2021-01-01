import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';
// import 'rxjs/Rx';
import {AuthService} from '../auth-service/authService';
import 'rxjs-compat/add/observable/of';
import 'rxjs-compat/add/operator/map';
import {catchError} from 'rxjs/operators';
import {EmailUtilService} from '../services/email-util.service';
import {apiConfig} from '../config/main-config';

// declare var require: any;
const Buffer = require('buffer/').Buffer;
const DEFAULT_AGE = 10000;
const pako = require('pako');

// tslint:disable:triple-equals
export class CacheEntry {
  url: string;
  request: string;
  response: HttpResponse<any>;
  exitTime: number;
}


@Injectable()
export class HttpService {

  constructor(private _http: HttpClient, private _userService: AuthService, private _router: Router,
              // private enumDataService: EnumDataService
  ) {
    this.authToken = this._userService.getToken();
  }

  errorObservable = catchError(err => {
    if (err.error) {
      if (err.error.message) {
        return throwError(err.error.message);
      } else {
        return throwError('Something went wrong !');
      }
    } else {
      return throwError(err);
    }
  });

  authToken: any = '';
  private baseUrl = '';
  cacheMap = new Map<string, CacheEntry>();

  percentDone: any;
  callEvent: any = 'events';

  /**
   * @description - This method will send back payload/response or throw error as per the status received
   * @param res - the response object received from the api calls
   */
  sendSuccessResponse(res) {
    if (res.status === 200 || res.status === 201) {
      if (res.payLoad) {
        const resData = this.changeBase64ToString(res);
        return resData;
      } else {
        return res.message;
      }
    } else if (res.status == 'active') {
      return res;
    } else if (res.status === 304 || 204) {
      throw new Error(res.message);
    } else {
      throw new Error(res.message);
    }
  }

  post(url: string, body, options?): Observable<any> {
    let httpOptions: { headers: HttpHeaders };

    if (options) {
      httpOptions = options;
    } else {
      // let headers = new HttpHeaders().set('Content-Type', 'application/json');
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.set('Content-Encoding', 'gzip');
      headers = headers.set('Content-Type', 'application/json');
      httpOptions = {
        headers
      };
      if (this._userService.getToken()) {
        httpOptions.headers = httpOptions.headers.set('authToken', this._userService.getToken());
      }
    }

    const compressedBody = pako.gzip(JSON.stringify(body));
    console.log('Request api :', this.baseUrl + url, ' requestBody : ', JSON.stringify(body));

    // console.log('compressedBody : ', pako.gzip(JSON.stringify(body)));
    return this._http
      .post(this.baseUrl + url, compressedBody.buffer, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        return this.sendSuccessResponse(res);
      });
  }

  postEncoded(url: string, body, options?): Observable<any> {
    let httpOptions: { headers: HttpHeaders };

    if (options) {
      httpOptions = options;
    } else {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.set('Content-Encoding', 'gzip');
      headers = headers.set('Content-Type', 'application/json');
      httpOptions = {
        headers
      };
      if (this._userService.getToken()) {
        httpOptions.headers = httpOptions.headers.set('authToken', this._userService.getToken());
      }
    }
    console.log('Request api :', this.baseUrl + url, ' requestBody : ', JSON.stringify(body));
    const inputData = {query: this.changeBase64Data(body)};
    const compressedBody = pako.gzip(JSON.stringify(inputData));

    return this._http
      .post(this.baseUrl + url, compressedBody.buffer, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {

        if (res.status === 200 || res.status === 201) {
          const resData = this.changeBase64ToString(res);
          return resData;
        } else {

          // this._router.navigate(['login']);
          throw new Error(res.message);
        }
      });
  }

  putEncoded(url: string, body, options?): Observable<any> {
    let httpOptions: { headers: HttpHeaders };

    if (options) {
      httpOptions = options;
    } else {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.set('Content-Encoding', 'gzip');
      headers = headers.set('Content-Type', 'application/json');

      // headers = headers.set('Content-Type', 'application/octet-stream');
      httpOptions = {
        headers
      };
      // httpOptions = {
      //   headers: new HttpHeaders().set('Content-Type', 'application/json')
      // };

      if (this._userService.getToken()) {
        httpOptions.headers = httpOptions.headers.set('authToken', this._userService.getToken());
      }
    }

    const inputData = {query: this.changeBase64Data(body)};
    const compressedBody = pako.gzip(JSON.stringify(inputData));
    console.log('Request api :', this.baseUrl + url, ' requestBody : ', JSON.stringify(body));

    return this._http
      .put(this.baseUrl + url, compressedBody.buffer, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {

        if (res.status === 200 || res.status === 201) {

          const resData = this.changeBase64ToString(res);
          return resData;
        } else {

          // this._router.navigate(['login']);
          throw new Error(res.message);
        }
      });
  }

  put(url: string, body, params?): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Content-Encoding', 'gzip');
    headers = headers.set('Content-Type', 'application/json');

    const httpOptions: any = {
      headers,
      params: undefined
    };
    if (this._userService.getToken()) {
      httpOptions.headers = httpOptions.headers.set('authToken', this._userService.getToken());
    }
    if (params != undefined) {
      httpOptions.params = params;
    }
    const compressedBody = pako.gzip(JSON.stringify(body));
    console.log('Request api :', this.baseUrl + url, ' requestBody : ', JSON.stringify(body));

    return this._http
      .put(this.baseUrl + url, JSON.stringify(body), httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        if (res == null) {
          return res;
        } else if (res.status === 200) {
          const resData = this.changeBase64ToString(res);
          return resData;
        } else {
          const err = new Error(res.message);
          throwError(err);
          // this._router.navigate(['login']);
        }
      });
  }

  putParam(url: string, body, params?): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json'), params
    };
    // if (params != undefined) {
    //   httpOptions = params;
    // }

    return this._http
      .put(this.baseUrl + url, body, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        if (res == null) {
          return res;
        } else if (res.status === 200) {
          const resData = this.changeBase64ToString(res);
          return resData;
        } else {
          const err = new Error(res.message);
          throwError(err);
          // this._router.navigate(['login']);
        }
      });
  }

  putWithStatusCode(url: string, body, options?) {
    let httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json')
    };
    if (options != undefined) {
      httpOptions = options;
    }

    return this._http
      .put(this.baseUrl + url, body, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        if (res == null) {
          return res;
        } else if (res.status === 200) {
          const resData = this.changeBase64ToString(res);
          return {res: resData, statusCode: res.status};
        } else {
          const err = new Error(res.message);
          throwError(err);
          // this._router.navigate(['login']);
        }
      });
  }

  putExternal(url: string, body, options?): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      reportProgress: true,
      observe: this.callEvent
    };
    if (options != undefined) {
      httpOptions = options;
    }
    console.log(HttpEventType.UploadProgress, 'HttpEventType.UploadProgress');

    return this._http
      .put<any>(this.baseUrl + url, body, httpOptions).pipe(this.errorObservable);
  }

  delete(url: string, body, options?): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json'),
      body
    };
    if (options != undefined) {
      httpOptions = options;
    }

    return this._http
      .request('delete', url, {body}).pipe(this.errorObservable)
      .map((res: any) => {
        if (res.status === 200) {
          const resData = this.changeBase64ToString(res);
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


  getEncoded(url: string, params, requestAge?: number): Observable<any> {
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
    let httpParams = new HttpParams();
    httpParams = httpParams.append('query', objJson64);
    let httpHeader: HttpHeaders;
    if (this._userService.getToken()) {
      httpHeader = new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json');
    } else {
      httpHeader = new HttpHeaders().set('Content-Type', 'application/json');
    }
    const httpOptions = {
      headers: httpHeader,
      params: httpParams
    };
    url = url.trim();
    return this._http
      .get(this.baseUrl + url, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        if ([200, 201, 202, 204].includes(res.status)) {
          const resData = this.changeBase64ToString(res);
          return resData;
        } else {
          // this._router.navigate(['login']);
          throw new Error(res.message);
        }
      });
  }

  getEncodedBasic(url: string, params, requestAge: number): Observable<any> {
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
    let httpParams = new HttpParams();
    httpParams = httpParams.append('query', objJson64);
    let httpHeader: HttpHeaders;
    if (this._userService.getToken()) {
      httpHeader = new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json');
    } else {
      httpHeader = new HttpHeaders().set('Content-Type', 'application/json');
    }
    const httpOptions = {
      headers: httpHeader,
      params: httpParams
    };
    url = url.trim();
    return this._http
      .get(this.baseUrl + url, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        if ([200].includes(res.status)) {
          const resData = this.changeBase64ToString(res);
          return resData;
        } else {
          // this._router.navigate(['login']);
          // throw new Error(res.message);
        }
      });
  }

  getWithoutAuth(url: string, params, requestAge: number = undefined): Observable<any> {
    if (!requestAge) {
      requestAge = DEFAULT_AGE;
    }
    // const objJson64 = this.changeBase64Data(params);
    const entry = this.cacheMap.get(url);
    if (entry) {
      const isExpired = entry.exitTime < Date.now();
      if (isExpired) {
        this.deleteExpiredCache();
      } else if (entry.request === params) {
        return Observable.of((entry.response));
      }
    }
    const httpParams = params;
    // httpParams = httpParams.append('query', params);
    let httpHeader: HttpHeaders;
    if (this._userService.getToken()) {
      httpHeader = new HttpHeaders().set('authToken', this._userService.getToken())
        .set('Content-Type', 'application/json');
    } else {
      httpHeader = new HttpHeaders().set('Content-Type', 'application/json');
    }
    const httpOptions = {
      headers: httpHeader,
      params: httpParams
    };
    url = url.trim();
    return this._http
      .get(this.baseUrl + url, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        if ([200].includes(res.status)) {
          const resData = this.changeBase64ToString(res);
          return resData;
        } else {
          // this._router.navigate(['login']);
          // throw new Error(res.message);
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
    return this.getHttpClient(this.baseUrl + url, httpOptions).pipe(this.errorObservable)
      .map((res: any) => {
        if (res.status === 200) {
          const resData = this.changeBase64ToString(res);
          return resData;
        } else if (res.status === 204) {
          return null;
        } else {
          // this._router.navigate(['login']);
          throw new Error(res.message);
        }
      });
  }

  getHttpClient(url, httpOptions?) {
    return this._http
      .get(url, httpOptions);
  }

  // created by sarvesh

  changeBase64Data(params): string {
    const objJsonStr = JSON.stringify(params);
    const objJsonB64 = Buffer.from(objJsonStr).toString('base64');
    return objJsonB64;
  }

  changeBase64ToString(res) {
    const encodedata = res.payLoad;
    try {
      const datavalue = (Buffer.from(encodedata, 'base64').toString('utf-8'));

      try {
        const responseData = JSON.parse(datavalue);
        return responseData;
      } catch (e) {
        return JSON.parse(EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(encodedata));
      }
    } catch (e) {
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
    return this._http
      .post(url, body, httpOptions)
      .pipe(
        catchError(err => of([]))

        // catchError(err => {
        //
        //   // return throwError(err);
        // })
      );
  }

  postExternal1(url: string, body, options?): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    if (options != undefined) {
      httpOptions = options;
    }
    return this._http
      .post(url, body, httpOptions);
  }


  getExternal(url: string, options?): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Origin', 'http://localhost:4200')
    };
    if (options != undefined) {
      httpOptions = options;
    }
    return this._http
      .get(url, httpOptions).pipe(
        catchError(err => of([]))

        // catchError(err => {
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
  getAws(url) {
    // let httpOptions = {
    //   headers: new HttpHeaders().set('Content-Type', 'application/json')
    // }
    return this._http.get(url).pipe(this.errorObservable)
      .map((res: any) => {
        if (res) {
          return res;
        } else {
          // this._router.navigate(['login']);
          throw new Error(res.message);
        }
      });
  }

  getBaseUrl() {
    return this.baseUrl;
  }
}
