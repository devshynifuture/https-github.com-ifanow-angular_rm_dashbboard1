import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { OrgSettingServiceService } from '../../../../org-setting-service.service';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberComponent implements OnInit, OnDestroy {
  usersForm: FormGroup;
  subscription: Subscription;
  isLoading: boolean;
  filteredUsers: any;
  selectedUser: any = {};
  @Input() data: any = {};
  advisorId: any;
  teamMember: FormGroup;
  teamMembers: any;
  selectedMember: any;
  showSpinner = false;

  constructor(
    private settingsService: SettingsService,
    private eventService: EventService,
    private fb: FormBuilder,
    private subInjectService : SubscriptionInject,
    private orgSetting: OrgSettingServiceService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.createForm();
    this.getdataForm('')
    this.getTeamMembers()
    if (this.data) {
      this.initializeUserDetails();
    }
    // this.subscribeValueChange();
  }

  initializeUserDetails() {

  }
  chooseMember() { }
  createForm() {
    this.usersForm = this.fb.group({
      userInput: [''],
    })
  }
  getdataForm(data) {
    this.teamMember = this.fb.group({
      userInput: [(!data) ? '' : (data.fullName), [Validators.required]],
      emailId: [(!data) ? '' : data.emailId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required]],
      userName: [(!data) ? '' : data.userName, [Validators.required]],
    });
  }
  getTeamMembers() {
    this.showSpinner = true
    const dataObj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getTeamMember(dataObj).subscribe((res) => {
      console.log('team member details', res)
      this.showSpinner = false
      this.teamMembers = res;
    });
  }
  getFormControl(): any {
    return this.teamMember.controls;
  }
  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  selectTeamMember(teamMember) {
    console.log(teamMember)
    this.selectedMember = teamMember
  }
  saveTeamMember(){
    let obj = {
      id: this.data.id,
      ChildId: 2809, //this.data.ChildId, // suchendra currently requires it as hardcoded
      emailId: this.selectedMember.email,
      mobileNo: this.selectedMember.mobile,
      parentName: this.selectedMember.fullName,
      parentId: 2808, //this.selectedMember.adminAdvisorId, // suchendra currently requires it as hardcoded
      roleName: this.selectedMember.role.roleName,
    }
    this.orgSetting.updateAccessControl(obj).subscribe((res) => {
      console.log('team member details', res)
      this.teamMembers = res;
    });
  }
  // mat auto complete search
  // subscribeValueChange() {
  //   this.subscription = this.usersForm
  //     .get('userInput')
  //     .valueChanges
  //     .pipe(
  //       debounceTime(300),
  //       tap(() => {
  //         this.isLoading = true;
  //         this.selectedUser = {};
  //       }),
  //       switchMap(value => this.settingsService.searchTeamMember({ user: value })
  //         .pipe(
  //           finalize(() => this.isLoading = false),
  //         )
  //       )
  //     )
  //     .subscribe(users => this.filteredUsers = users.results);
  // }

  // when user chooses an option from the auto complete dropdown
  chooseUser() {
    this.selectedUser = this.usersForm.get('userInput').value;
  }

  save() {
    if (!this.selectedUser.id) {
      this.eventService.openSnackBar("No User Selected");
    } else {
      let dataObj = {
        ...this.data.mainData,
      };
      const obj = {
        "childId": 0,
        "emailId": "string",
        "mobileNo": "string",
        "name": "string",
        "parentId": 0,
        "roleName": "string"
      };
      this.settingsService.editAccessRightOfUser(dataObj).subscribe((res) => {
        this.close(true);
        this.eventService.openSnackBar("Reporting Manager Updated Successfully");
      }, (err) => {
        console.error(err);
        this.eventService.openSnackBar("Error occured.");
      });
    }
  }

  close(status = false){
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: status});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
