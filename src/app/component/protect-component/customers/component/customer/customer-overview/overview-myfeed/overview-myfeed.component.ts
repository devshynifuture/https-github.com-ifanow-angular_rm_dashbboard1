import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-overview-myfeed',
  templateUrl: './overview-myfeed.component.html',
  styleUrls: ['./overview-myfeed.component.scss']
})
export class OverviewMyfeedComponent implements OnInit {
  clientData: typeof AuthService;

  constructor() { }

  ngOnInit() {
    this.clientData = AuthService.getClientData();
  }

}
