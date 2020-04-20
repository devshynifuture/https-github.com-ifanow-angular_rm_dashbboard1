import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {SettingsService} from '../../../../settings.service';
import {AuthService} from 'src/app/auth-service/authService';
import {ValidatorType} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {MatProgressButtonOptions} from '../../../../../../../../common/progress-button/progress-button.component';

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
  counter = 0;
  isLoading = true;
  validatorType = ValidatorType;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Login to your account',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  mobileNumberFA:FormArray;

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
    };
    this.settingsService.getUserRolesGlobalData(obj).subscribe((res) => {
      this.roles = res;
      this.loader(-1);
    }, err => {this.eventService.openSnackBar(err, "Dismiss")});
  }

  createForm() {
    const roleId = this.data.mainData.role ? this.data.mainData.role.id : '';
    this.teamMemberFG = this.fb.group({
      adminAdvisorId: [this.data.mainData.adminAdvisorId || this.advisorId],
      parentId: this.advisorId,
      fullName: [this.data.mainData.fullName || '',
        [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.PERSON_NAME)]],
      emailId: [this.data.mainData.email || '', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      // mobileNo: [this.data.mainData.mobile || '', [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      roleId: [roleId, [Validators.required]],
    });
  }

  save() {
    if (this.teamMemberFG.invalid || this.mobileNumberFA.invalid) {
      this.teamMemberFG.markAllAsTouched();
      this.mobileNumberFA.markAllAsTouched();
    } else {
      if (this.barButtonOptions.active) {
      } else {
        this.barButtonOptions.active = true;
        if (this.data.is_add_call) {
          this.addTeamMember();
        } else {
          this.editTeamMember();
        }
      }
    }
  }

  addTeamMember() {
    const dataObj = {
      ...this.teamMemberFG.value,
      mobileList: this.mobileNumberFA.value,
    };
    this.settingsService.addTeamMember(dataObj).subscribe((res) => {
      this.close(true);
      this.eventService.openSnackBar('Invitation sent successfully');
    }, (err) => {
      console.error(err);
      this.barButtonOptions.active = false;
      this.eventService.openSnackBar('Error occured.');
    });
  }

  editTeamMember() {
    const dataObj = {
      id: this.data.mainData.id,
      roleId: this.teamMemberFG.controls.roleId.value,
    };

    this.settingsService.editTeamMember(dataObj).subscribe((res) => {
      this.close(true);
      this.eventService.openSnackBar('Member data updated');
    }, (err) => {
      console.error(err);
      this.barButtonOptions.active = true;
      this.eventService.openSnackBar('Error occured.');
    });
  }

  close(status = false) {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: status});
  }

  loader(countAdder) {
    this.counter += countAdder;
    if (this.counter == 0) {
      this.isLoading = false;
      this.checkIfRoleExists();
    } else {
      this.isLoading = true;
    }
  }

  checkIfRoleExists() {
    const teamMemberRoleId = this.teamMemberFG.get('roleId') as FormControl;
    const roleExist = this.roles.find((role) => {
      if (role.roleMasterId == teamMemberRoleId.value) {
        teamMemberRoleId.setValue(role.id);
        return true;
      } else {
        return false;
      }
    });

    if (!roleExist) {
      teamMemberRoleId.setValue('');
      this.teamMemberFG.updateValueAndValidity();
    }
  }

  getNumberDetails(formArr:FormArray) {
    this.mobileNumberFA = formArr;
  }
}
