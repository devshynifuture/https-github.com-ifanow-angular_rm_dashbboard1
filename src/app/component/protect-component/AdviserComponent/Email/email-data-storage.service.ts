import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailDataStorageService {
  inboxEmailList: any = [];
  sentEmailList: any = [];
  draftEmailList: any = [];
  starredEmailList: any = [];
  trashEmailList: any = [];

  constructor() { }

  navCountObj: any = null;
  prevNavCountObj = null;

  inboxEmailDataListObs = new BehaviorSubject<any | null>(null);
  sentEmailDataListObs = new BehaviorSubject<any | null>(null);
  draftEmailDataListObs = new BehaviorSubject<any | null>(null);
  trashEmailDataListObs = new BehaviorSubject<any | null>(null);
  starredEmailDataListObs = new BehaviorSubject<any | null>(null);
  gmailThreadsObs = new BehaviorSubject<any | null>(null);
  canHitGmailApiVal = true;
  unreadCount = null;

  navCountObs = new BehaviorSubject(null);

  //getting data

  getNavCountThroughObs(): Observable<any | null> {
    return this.navCountObs.asObservable()
  }

  getUnReadCount() {
    return this.unreadCount;
  }

  getInboxEmailDataThroughObs(): Observable<any | null> {
    return this.inboxEmailDataListObs.asObservable();
  }

  getSentEmailDataThroughObs(): Observable<any | null> {
    return this.sentEmailDataListObs.asObservable();
  }

  getDraftEmailDataThroughObs(): Observable<any | null> {
    return this.draftEmailDataListObs.asObservable();
  }

  getTrashEmailDataThroughObs(): Observable<any | null> {
    return this.trashEmailDataListObs.asObservable();
  }

  getStarredEmailDataThroughObs(): Observable<any | null> {
    return this.starredEmailDataListObs.asObservable();
  }

  getGmailThreadsThroughObs(): Observable<any | null> {
    return this.gmailThreadsObs.asObservable();
  }

  canHitGmailApi() {
    return this.canHitGmailApiVal;
  }

  // storing data

  storeNavCount(data): void {
    this.navCountObj = data;
    this.navCountObs.next(data);
  }

  storeInboxEmailDataList(data): void {
    this.inboxEmailList = data;
    this.inboxEmailDataListObs.next(data);
  }

  storeSentEmailDataList(data): void {
    this.sentEmailList = data;
    this.sentEmailDataListObs.next(data);
  }

  storeDraftEmailDataList(data): void {
    this.draftEmailList = data;
    this.draftEmailDataListObs.next(data);
  }

  storeStarredEmailDataList(data): void {
    this.starredEmailList = data;
    this.starredEmailDataListObs.next(data);
  }

  storeTrashEmailDataList(data): void {
    this.trashEmailList = data;
    this.trashEmailDataListObs.next(data);
  }

  storeUnReadCount(data): void {
    this.unreadCount = data;
  }

  storeGmailThreads(data): void {
    this.gmailThreadsObs.next(data);
  }

  setCanHitGmailApi(data): void {
    this.canHitGmailApiVal = data;
  }

  // checks counts empty
  isCountEmpty() {
    if (this.navCountObj) {
      return false;
    }
    return true;
  }

}