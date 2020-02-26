import { EventService } from './../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { FileOrderingUpperComponent } from './file-ordering-upper/file-ordering-upper.component';

@Component({
  selector: 'app-file-ordering-upload',
  templateUrl: './file-ordering-upload.component.html',
  styleUrls: ['./file-ordering-upload.component.scss']
})
export class FileOrderingUploadComponent implements OnInit {

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

}
