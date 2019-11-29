import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../../../../Data-service/event.service";

@Component({
  selector: 'app-upper-customer',
  templateUrl: './upper-customer.component.html',
  styleUrls: ['./upper-customer.component.scss']
})
export class UpperCustomerComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
  }

  close() {
    const fragmentData = {
      direction: 'top',
      componentName: UpperCustomerComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
}
