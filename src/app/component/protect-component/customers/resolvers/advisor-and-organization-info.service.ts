import { Injectable } from '@angular/core';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { SettingsService } from '../../AdviserComponent/setting/settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { map, catchError } from 'rxjs/operators';
import { Resolve } from '@angular/router';
import { EventService } from 'src/app/Data-service/event.service';

@Injectable()
export class AdvisorAndOrganizationInfoService implements Resolve<any> {

  private clientData:any;
  private advisorId:any;
  constructor(
    private settingsService: SettingsService,
    private eventService: EventService,
  ) {
    this.clientData = AuthService.getClientData();
    this.advisorId = this.clientData.advisorId;
  }
  resolve(): Observable<any> {
    let orgDetail = this.settingsService.getOrgProfile({advisorId: this.advisorId})
  
    // advisor details
    let advisorDetail = this.settingsService.getPersonalProfile({id: this.advisorId})

    // NEED TO HANDLE 
    return forkJoin(advisorDetail.pipe(
      map(data =>{
         AuthService.setAdvisorDetails(data)
         return data
      }),
      catchError(() => {
        AuthService.setAdvisorDetails({})
        return of({err: true})
      })
    ), orgDetail.pipe(
      map(data => {
        AuthService.setOrgDetails(data)
        return data
      }),
      catchError(() => {
        AuthService.setOrgDetails({})
        return of({err: true})
      })
    ))
    .map(([advisorDetailRes, orgDetailRes])=>{
      if(advisorDetailRes == undefined) {
        AuthService.setAdvisorDetails({})
      }
      if(orgDetailRes == undefined) {
        AuthService.setOrgDetails({})
      }
      return true
    })
  }


}
