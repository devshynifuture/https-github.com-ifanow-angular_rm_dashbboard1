import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmailServiceService } from '../../../email-service.service';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit, AfterViewInit {
  emailObj: Object;
  constructor(private emailService: EmailServiceService) { }
  emailSubscription;
  ngOnInit() {
    this.emailSubscription = this.emailService.data.subscribe(response => {
      this.emailObj = response;
      console.log(response);
    });
  }

  ngAfterViewInit() {
    this.emailSubscription.unsubscribe();
  }

}
