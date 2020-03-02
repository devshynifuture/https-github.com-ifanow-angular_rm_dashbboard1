import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-insurance-upper',
  templateUrl: './add-insurance-upper.component.html',
  styleUrls: ['./add-insurance-upper.component.scss']
})
export class AddInsuranceUpperComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit() {
  }
  close(){
    const fragmentData = {
      direction: 'top',
      componentName: AddInsuranceUpperComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
}
