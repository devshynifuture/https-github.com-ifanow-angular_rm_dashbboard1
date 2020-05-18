import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PeopleService } from '../../../../people.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { Router } from '@angular/router';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
  selector: 'app-leads-clients',
  templateUrl: './leads-clients.component.html',
  styleUrls: ['./leads-clients.component.scss']
})
export class LeadsClientsComponent implements OnInit {
  clientOwnerList: any;
  flag: any;
  clientData: any;
  selectedClient;
  convertClientForm;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & NEXT',
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
  clientRoles: any;

  constructor(private router: Router, private fb: FormBuilder, private peopleService: PeopleService, private subInjectService: SubscriptionInject, private eventService: EventService, private enumService: EnumServiceService, private enumDataService: EnumDataService,
  ) {
  }

  ngOnInit() {
  }

  set data(data) {
    this.clientData = data;
    this.clientRoles = this.enumService.getClientRole();
    this.convertClientForm = this.fb.group({
      clientOwner: [data.advisorId, [Validators.required]],
      confirmRole: ['', [Validators.required]],
      sendEmailFlag: [true, [Validators.required]]
    });
    this.getClientList(data);
  }

  getClientList(data) {
    const obj = {
      advisorId: AuthService.getAdvisorId()
    };
    this.peopleService.getTeamMemberList(obj).subscribe(
      data => {
        console.log(data);
        this.clientOwnerList = data;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  convertIntoLead() {
    if (this.convertClientForm.invalid) {
      this.convertClientForm.markAllAsTouched();
      return true;
    }
    this.barButtonOptions.active = true;
    const obj = {
      clientId: this.clientData.clientId,
      roleId: parseInt(this.convertClientForm.get('confirmRole').value),
      status: 1, // 1- client, 2 - lead
      advisorId: this.convertClientForm.get('clientOwner').value,
      sendEmail: this.convertClientForm.get('sendEmailFlag').value
    };
    this.peopleService.updateClientStatus(obj).subscribe(
      data => {
        console.log(data);
        this.enumDataService.searchClientList();
        this.enumDataService.searchClientAndFamilyMember();
        this.router.navigate(['/admin/people/clients']);
        this.close();
        this.barButtonOptions.active = false;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.barButtonOptions.active = false;
      }
    );
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
