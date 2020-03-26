import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SettingsService } from '../../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-new-team-member',
  templateUrl: './new-team-member.component.html',
  styleUrls: ['./new-team-member.component.scss']
})
export class NewTeamMemberComponent implements OnInit {
  @Input() data:any = {};
  advisorId: any;
  roles: any;
  teamMemberFG: FormGroup;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private eventService: EventService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.roles = this.data.roles;
  }

  createForm(){
    this.teamMemberFG = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.PERSON_NAME)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      mobile: ['', [Validators.required, Validators.maxLength(50)], Validators.pattern(ValidatorType.NUMBER_ONLY)],
      role: ['', [Validators.required]],
    });
  }

  sendInvitation(){
    if(this.teamMemberFG.invalid) {
      this.teamMemberFG.markAllAsTouched();
    } else {
      let dataObj = {
        advisorId: this.advisorId,
        ...this.teamMemberFG.getRawValue()
      };

      this.settingsService.sendInvitationToMember(dataObj).subscribe((res)=>{
        this.eventService.openSnackBar("Invitation sent successfully");
      });
    }
  }
}
