import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../../Data-service/event.service';

@Component({
  selector: 'app-marketplace-review-request-bulk',
  templateUrl: './marketplace-review-request-bulk.component.html',
  styleUrls: ['./marketplace-review-request-bulk.component.scss']
})
export class MarketplaceReviewRequestBulkComponent implements OnInit {

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
  }

}
