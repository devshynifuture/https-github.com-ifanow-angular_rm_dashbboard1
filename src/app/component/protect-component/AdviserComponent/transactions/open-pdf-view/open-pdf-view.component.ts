import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-open-pdf-view',
  templateUrl: './open-pdf-view.component.html',
  styleUrls: ['./open-pdf-view.component.scss']
})
export class OpenPdfViewComponent implements OnInit {
  isFileUploading: boolean;
  showStatus: boolean;

  constructor(private eventService: EventService) { }

  ngOnInit() {
  }

  getFileDetails(e) {
    console.log('file', e);
    const file = e.target.files[0];
    this.showStatus = undefined;
    const requestMap = {
      advisorId: AuthService.getAdvisorId()
    };
    this.isFileUploading = true;
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.BSE_UCC_FILE_UPLOAD,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        console.log('getFileDetails uploadFileToServer callback item : ', item);
        console.log('getFileDetails uploadFileToServer callback status : ', status);
        console.log('getFileDetails uploadFileToServer callback headers : ', headers);
        console.log('getFileDetails uploadFileToServer callback response : ', response);
        this.isFileUploading = false;
        if (status == 200) {
          this.showStatus = true
          const responseObject = JSON.parse(response);
          console.log('onChange file upload success response url : ', responseObject.url);
          this.eventService.openSnackBar('File uploaded successfully');
        } else {
          this.showStatus = false
          const responseObject = JSON.parse(response);
          // this.eventService.openSnackBar(responseObject.message, 'Dismiss', null, 60000);
        }
      });
  }
}
