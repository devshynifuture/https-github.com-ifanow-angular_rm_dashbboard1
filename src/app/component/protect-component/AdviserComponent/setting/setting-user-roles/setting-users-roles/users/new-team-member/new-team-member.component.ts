import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../../../../settings.service';
import {AuthService} from 'src/app/auth-service/authService';
import {ValidatorType} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {LoginService} from '../../../../../../../no-protected/login/login.service';

@Component({
  selector: 'app-new-team-member',
  templateUrl: './new-team-member.component.html',
  styleUrls: ['./new-team-member.component.scss']
})
export class NewTeamMemberComponent implements OnInit {
  @Input() data: any = {};
  advisorId: any;
  roles: any;
  teamMemberFG: FormGroup;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private eventService: EventService,
    private loginService: LoginService
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.teamMemberFG = this.fb.group({
      adminAdvisorId: [this.data.mainData.adminAdvisorId || this.advisorId],
      fullName: [this.data.mainData.fullName, [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.PERSON_NAME)]],
      emailId: [this.data.mainData.emailId, [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.EMAIL)]],
      mobileNo: [this.data.mainData.mobileNo, [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      roleId: [this.data.mainData.roleId, [Validators.required]],
    });
  }

  save() {
    if(this.teamMemberFG.invalid) {
      this.teamMemberFG.markAllAsTouched();
    } else {
      if(this.data.is_add_call) {
        this.addTeamMember();
      } else {
        this.editTeamMember();
      }
    }
  }

  addTeamMember() {
    let dataObj = this.teamMemberFG.value;
    this.settingsService.addTeamMember(dataObj).subscribe((res)=>{
      this.close(true);
      this.eventService.openSnackBar("Invitation sent successfully");
    }, (err) => {
      console.error(err);
      this.eventService.openSnackBar("Error occured.");
    });
  }

  editTeamMember() {
    let dataObj = {
      ...this.data.mainData,
      ...this.teamMemberFG.value,
    };
    this.settingsService.addTeamMember(dataObj).subscribe((res)=>{
      this.close(true);
      this.eventService.openSnackBar("Invitation sent successfully");
    }, (err) => {
      console.error(err);
      this.eventService.openSnackBar("Error occured.");
    });
  }

  close(status = false){
    this.eventService.changeUpperSliderState({state: 'close', refreshRequired: status});
  }
}
