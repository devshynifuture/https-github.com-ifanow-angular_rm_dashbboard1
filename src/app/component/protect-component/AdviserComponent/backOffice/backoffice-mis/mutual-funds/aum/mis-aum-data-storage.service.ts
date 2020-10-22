import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

interface misData {
  graphData: {},
  totalAum: {},
  clientWithoutMf: {},
  subCatAum: {},
  misData1: {}
}

@Injectable({
  providedIn: 'root'
})
export class MisAumDataStorageService {
  constructor(){}

  canRefresh: boolean = true;
  obj = {
    graphData: null,
    totalAum: null,
    clientWithoutMf: null,
    subCatAum: null,
    misData1: null
  }
  arnRiaValue = -1;
  misDataObs = new BehaviorSubject<misData | null>(null);
  misGraphDataObs = new BehaviorSubject(null);
  misTotalAumDataObs = new BehaviorSubject(null);
  misClientWithoutMfDataObs = new BehaviorSubject(null);
  misSubCatAumDataObs = new BehaviorSubject(null);
  misMisData1Obs = new BehaviorSubject(null);
  getDataFromApiObs = new BehaviorSubject(null);
  arnRiaDetailDataObs = new BehaviorSubject(this.arnRiaValue);
  
  changeRefreshState(): void{
    this.canRefresh = !this.canRefresh;
  }

  doDataExist(){
    for (const key in this.obj) {
      if (Object.prototype.hasOwnProperty.call(this.obj, key)) {
        const element = this.obj[key];  
        if(!element){
          return false;
        }
      }
    }
    return true;
  }
  
  getRefreshState(): boolean{
    return this.canRefresh;
  }

  // get data
  getGraphData():Observable<any>{
    return this.misGraphDataObs.asObservable();
  }

  getTotalAumData():Observable<any>{
    return this.misTotalAumDataObs.asObservable()
  }

  getClientWithoutMfData():Observable<any>{
    return this.misClientWithoutMfDataObs.asObservable();
  }

  getSubCatAumData():Observable<any>{
    return this.misSubCatAumDataObs.asObservable();
  }

  getMisData1():Observable<any>{
    return this.misMisData1Obs.asObservable();
  }

  getArnRiaDetail():Observable<any>{
    return this.arnRiaDetailDataObs.asObservable();
  }

  setArnRiaDetail(value){
    this.arnRiaValue = value;
    this.arnRiaDetailDataObs.next(this.arnRiaValue);
  }

  isArnRiaValueMinusOne(){
    return this.arnRiaValue === -1 ? true: false;
  }

  canWeGetDataFromApi(){
    return this.getDataFromApiObs.asObservable();
  }
  
  //  set data
  setGraphData(value: {}){
    this.obj.graphData = value;
    this.misGraphDataObs.next(value);
  }

  setTotalAumData(value: {}){
    this.obj.totalAum = value;
    this.misTotalAumDataObs.next(value);
  }

  setClientWithoutMfData(value: {}){
    this.obj.clientWithoutMf = value;
    this.misClientWithoutMfDataObs.next(value);
  }

  setSubCatAumData(value: {}){
    this.obj.subCatAum = value;
    this.misSubCatAumDataObs.next(value);
  }

  setMisData1(value: {}){
    this.obj.misData1 = value;
    this.misMisData1Obs.next(value);
    this.setAllMisData();
  }

  setAllMisData(){
    this.misDataObs.next(this.obj);
  }

  getAllMisData(){
    return this.misDataObs.asObservable();
  }

  callApiData(){
    return this.getDataFromApiObs.next(true);
  }

  setCallApiData(value){
    this.getDataFromApiObs.next(value);
  }
}