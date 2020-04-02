import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberComponent implements OnInit, OnDestroy {
  usersForm:FormGroup;
  subscription: Subscription;
  isLoading: boolean;
  filteredUsers: any;
  selectedUser:any = {};
  @Input() data:any = {};
  advisorId: any;

  constructor(
    private settingsService: SettingsService,
    private eventService: EventService,
    private fb: FormBuilder,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.createForm();
    if(this.data) {
      this.initializeUserDetails();
    }
  }

  initializeUserDetails(){

  }

  createForm(){
    this.usersForm = this.fb.group({
      userInput: [''],
    })
  }

  subscribeValueChange() {
    this.subscription = this.usersForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
          this.selectedUser = {};
        }),
        switchMap(value => this.settingsService.searchTeamMember({ user: value })
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(users => this.filteredUsers = users.results);
  }

  chooseUser(){
    this.selectedUser = this.usersForm.get('userInput').value;
  }

  save(){
    if(!this.selectedUser.id) {
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
        this.settingsService.editAccessRightOfUser(dataObj).subscribe((res)=>{
          this.close(true);
          this.eventService.openSnackBar("Reporting Manager Updated Successfully");
        }, (err) => {
          console.error(err);
          this.eventService.openSnackBar("Error occured.");
        });
    }
  }

  close(status = false){
    this.eventService.changeUpperSliderState({state: 'close', refreshRequired: status});
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
