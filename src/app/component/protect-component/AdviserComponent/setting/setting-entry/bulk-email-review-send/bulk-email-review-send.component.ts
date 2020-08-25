import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-bulk-email-review-send',
  templateUrl: './bulk-email-review-send.component.html',
  styleUrls: ['./bulk-email-review-send.component.scss']
})
export class BulkEmailReviewSendComponent implements OnInit {

  constructor(
    public authService: AuthService,
    protected eventService: EventService
  ) { }

  logoText = 'Your Logo here';


  ngOnInit() {
  }

  @Input() set data(data) {

  }

  close() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: false });
  }
}
