import { HttpService } from './../../../../../http-service/http-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackofficeFolioMappingService {
  constructor(
    private http: HttpService,
  ) { }


}