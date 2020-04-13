import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SettingsService } from '../../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

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
  counter: number = 0;
  isLoading: boolean = true;
  validatorType = ValidatorType

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.createForm();
    this.loadRoles();
  }

  loadRoles() {
    this.loader(1);
    const obj = {
      advisorId: this.advisorId
    }

    this.settingsService.getUserRolesGlobalData(obj).subscribe((res) => {
      this.roles = res;
      this.loader(-1);
    })
  }

  createForm() {
    let roleId = this.data.mainData.role ? this.data.mainData.role.id : '';
    this.teamMemberFG = this.fb.group({
      adminAdvisorId: [this.data.mainData.adminAdvisorId || this.advisorId],
      fullName: [this.data.mainData.fullName || '', [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.PERSON_NAME)]],
      emailId: [this.data.mainData.email || '', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      mobileNo: [this.data.mainData.mobile || '', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      roleId: [roleId, [Validators.required]],
    });
  }

  save() {
    if (this.teamMemberFG.invalid) {
      this.teamMemberFG.markAllAsTouched();
    } else {
      if (this.data.is_add_call) {
        this.addTeamMember();
      } else {
        this.editTeamMember();
      }
    }
  }

  addTeamMember() {
    let dataObj = this.teamMemberFG.value;
    this.settingsService.addTeamMember(dataObj).subscribe((res) => {
      this.close(true);
      this.eventService.openSnackBar("Invitation sent successfully");
    }, (err) => {
      console.error(err);
      this.eventService.openSnackBar("Error occured.");
    });
  }

  editTeamMember() {
    let dataObj = {
      id: this.data.mainData.id,
      roleId: this.teamMemberFG.controls.roleId.value,
    };

    this.settingsService.editTeamMember(dataObj).subscribe((res) => {
      this.close(true);
      this.eventService.openSnackBar("Invitation sent successfully");
    }, (err) => {
      console.error(err);
      this.eventService.openSnackBar("Error occured.");
    });
  }

  close(status = false) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }

  loader(countAdder) {
    this.counter += countAdder;
    if (this.counter == 0) {
      this.isLoading = false;
      if (this.data.is_add_call) {
        this.checkIfRoleExists();
      }
    } else {
      this.isLoading = true;
    }
  }
  checkIfRoleExists() {
    const teamMemberRoleId = this.teamMemberFG.get('roleId') as FormControl;
    const roleExist = this.roles.find(role => role.id == teamMemberRoleId.value);
    if (!roleExist) {
      teamMemberRoleId.setValue('');
      this.teamMemberFG.updateValueAndValidity();
    }
  }
}
