import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-client-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class ClientDocumentsComponent implements OnInit {

  data:any = {};
  isLoading = true;
  constructor() { }

  ngOnInit() {
    this.data = AuthService.getSubscriptionUpperSliderData();
    this.isLoading = false;
  }
}
