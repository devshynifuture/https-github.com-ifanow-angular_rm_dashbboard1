import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackofficeFileUploadService {
  filter:any;
  filterdata= new Subject();
  constructor() { }

  addFilterData(data){
    this.filter = data;
    this.filterdata.next(this.filter)
  }

  getFilterData(){
    return this.filterdata.asObservable();
  }
}
