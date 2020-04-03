import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PeopleService } from '../../../../people.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-leads-clients',
  templateUrl: './leads-clients.component.html',
  styleUrls: ['./leads-clients.component.scss']
})
export class LeadsClientsComponent implements OnInit {
  clientOwnerList: any;
  flag: any;

  constructor(private fb: FormBuilder, private peopleService: PeopleService, private subInjectService: SubscriptionInject, private eventService: EventService) { }
  convertClientForm;
  selectedClient
  ngOnInit() {
    this.convertClientForm = this.fb.group({
      clientRole: [, [Validators.required]],
      confirmRole: [, [Validators.required]],
      userName: [, [Validators.required]]
    })
  }
  set data(data) {
    this.getClientList(data);
  }
  getClientList(data) {
    let obj =
    {
      advisorId: 1
    }
    this.peopleService.getTeamMemberList(obj).subscribe(
      data => {
        console.log(data);
        this.clientOwnerList = data;
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  convertIntoLead() {
    if (this.convertClientForm.invalid) {
      this.convertClientForm.markAllAsTouched()
      return true;
    }
    let obj =
    {
      "clientId": 61,
      "roleId": this.selectedClient.roleId,
      "status": 1,
      "advisorId": this.selectedClient.advisorId
    }
    this.peopleService.loginWithPassword(obj).subscribe(
      data => {
        console.log(data);
        this.close();
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
