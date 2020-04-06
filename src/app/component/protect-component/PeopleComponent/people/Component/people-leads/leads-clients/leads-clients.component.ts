import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {PeopleService} from '../../../../people.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';

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

  constructor(private fb: FormBuilder, private peopleService: PeopleService, private subInjectService: SubscriptionInject, private eventService: EventService) {
  }

  ngOnInit() {
    this.convertClientForm = this.fb.group({
      clientOwner: [, [Validators.required]],
      confirmRole: [, [Validators.required]],
      sendEmailFlag: [true, [Validators.required]]
    });
  }

  set data(data) {
    this.clientData = data;
    this.getClientList(data);
  }

  getClientList(data) {
    const obj = {
      advisorId: 1
    };
    this.peopleService.getAllCLients(obj).subscribe(
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
    const obj = {
      clientId: this.clientData.clientId,
      roleId: parseInt(this.convertClientForm.get('confirmRole').value),
      status: 1, // 1- client, 2 - lead
      advisorId: this.convertClientForm.get('clientOwner').value.advisorId,
      sendEmail: this.convertClientForm.get('sendEmailFlag').value
    };
    this.peopleService.updateClientStatus(obj).subscribe(
      data => {
        console.log(data);
        this.close();
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
