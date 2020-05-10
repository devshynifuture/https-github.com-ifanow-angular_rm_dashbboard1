import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { SettingsService } from '../../AdviserComponent/setting/settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { map, catchError } from 'rxjs/operators';
import { Resolve } from '@angular/router';
import { EventService } from 'src/app/Data-service/event.service';

@Injectable()
export class AdvisorAndOrganizationInfoService implements Resolve<boolean> {

  private clientData:any;
  private advisorId:any;
  constructor(
    private settingsService: SettingsService,
    private eventService: EventService,
  ) {
    this.clientData = AuthService.getClientData();
    this.advisorId = this.clientData.advisorId;
  }
  resolve(): Observable<boolean> {
    let orgDetail = this.settingsService.getOrgProfile({advisorId: this.advisorId})
  
    // advisor details
    let advisorDetail = this.settingsService.getPersonalProfile({id: this.advisorId})

    // NEED TO HANDLE 
    return combineLatest(advisorDetail.pipe(
      map(data => AuthService.setAdvisorDetails(data))
    ), orgDetail.pipe(
      map(data => AuthService.setOrgDetails(data))
    ))
    .map(([advisorDetail, orgDetail])=>{
      if(advisorDetail === null && orgDetail === null) return false
      return true
    })
  }


}
