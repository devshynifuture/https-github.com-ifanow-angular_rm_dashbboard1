import { Component, OnInit, Input } from '@angular/core';
import { EventService } from "../../../../../../Data-service/event.service";

@Component({
  selector: 'app-upper-customer',
  templateUrl: './upper-customer.component.html',
  styleUrls: ['./upper-customer.component.scss']
})
export class UpperCustomerComponent implements OnInit {
  selected = 0;
  fragmentData: any;
  @Input() set data(data) {
    this.fragmentData = data;
    console.log("this is what im getting:: from called function::", data);
  }
  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    (this.fragmentData == 'mutualFunds') ? this.selected = 0 : this.selected = 1;
  }

  close(flag) {
    const fragmentData = {
      state: 'close',
      refreshRequired: flag
    };

    this.eventService.changeUpperSliderState(fragmentData);

  }
}
