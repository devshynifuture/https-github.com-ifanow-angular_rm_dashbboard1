import { EventService } from './../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { SupportUpperSliderComponent } from './support-upper-slider/support-upper-slider.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.scss']
})
export class SupportDashboardComponent implements OnInit {

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

  openUpperSlider(data) {
    const fragmentData = {
      flag: 'openUpper',
      id: 1,
      data,
      direction: 'top',
      componentName: SupportUpperSliderComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

}
