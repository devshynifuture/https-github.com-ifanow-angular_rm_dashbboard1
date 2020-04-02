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
    this.roles = this.data.roles;
  }

  createForm() {
    this.teamMemberFG = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.PERSON_NAME)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      mobile: ['', [Validators.required, Validators.maxLength(50)], Validators.pattern(ValidatorType.NUMBER_ONLY)],
      role: ['', [Validators.required]],
    });
  }

  sendInvitation() {
    if (this.teamMemberFG.invalid) {
      this.teamMemberFG.markAllAsTouched();
    } else {
      const dataObj = {
        emailList: [
          {
            userType: 1,
            email: this.teamMemberFG.get('email').value
          }
        ],
        displayName: this.teamMemberFG.get('name').value,
        mobileList: [
          {
            userType: 1,
            mobileNo: this.teamMemberFG.get('mobile').value,
          }
        ],
        name: this.teamMemberFG.get('fullName').value,
        userType: 1,

        parentId: this.advisorId
      };

      this.loginService.register(dataObj).subscribe(
        data => {
          console.log(data);
          const forgotPassObjData = {
            mobileNo: this.teamMemberFG.get('mobile').value,
            emailId: this.teamMemberFG.get('email').value,
            flag: true,
            userType: data.userType,
            userId: data.userId,
            userData: data
          };
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }
  }
}
