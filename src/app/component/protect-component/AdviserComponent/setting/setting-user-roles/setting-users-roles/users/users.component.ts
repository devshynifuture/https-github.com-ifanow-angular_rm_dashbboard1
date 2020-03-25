import { Component, OnInit } from '@angular/core';
import { AddArnRiaDetailsComponent } from '../../../setting-entry/add-arn-ria-details/add-arn-ria-details.component';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { NewTeamMemberComponent } from './new-team-member/new-team-member.component';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  advisorId:any;
  userList:any[];
  roles:any[];

  constructor(
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private eventService: EventService,
  ) { 
    this.advisorId = AuthService.getAdvisorId();
    
    this.userList = [
      {
        name: 'Sagar',
        roleName: 'Admin',
        clientCount: 343,
        img: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
      },
      {
        name: 'Vaibhav',
        roleName: 'Para Planner',
        clientCount: 123,
        img: 'https://scontent.fbom20-1.fna.fbcdn.net/v/t1.0-9/79682252_100342641466351_8876269414400393216_n.jpg?_nc_cat=109&_nc_sid=dd9801&_nc_ohc=z22kOWOIwhkAX9H6H3B&_nc_ht=scontent.fbom20-1.fna&oh=5ac8145b6e06768047698a9a4a844d5c&oe=5E9FCDB9',
      },
    ]
  }

  ngOnInit(){
    // this.loadRoles();
    // this.loadUsers();
  }

  loadUsers(){
    const dataObj = {
      advisorId: this.advisorId
    }
    this.settingsService.getTeamMembers(dataObj).subscribe((res)=>{
      this.userList = res;
    });
  }

  loadRoles(){
    const dataObj = {
      advisorId: this.advisorId
    }
    this.settingsService.getRoles(dataObj).subscribe((res)=>{
      this.roles = res;
    });
  }
  
  newTeamMember() {
    if(this.roles && this.roles.length > 0) {
      const fragmentData = {
        flag: 'add-ARI-RIA-details',
        data: this.roles,
        id: 1,
        state: 'open35',
        componentName: NewTeamMemberComponent
      };
      this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
        sideBarData => {
          if (UtilService.isDialogClose(sideBarData)) {
            if (UtilService.isRefreshRequired(sideBarData)) {
  
            }
          }
        }
      );
    } else {
      this.eventService.openSnackBar("You need to define roles before you could add members");
    }
  }
}
