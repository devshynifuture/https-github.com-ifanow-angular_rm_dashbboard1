import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileHandle } from 'src/app/common/directives/upload-file.directive';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.scss']
})
export class ClientUploadComponent implements OnInit {
  files: FileHandle[];

  constructor(private subInjectService: SubscriptionInject) { }
  ngOnInit() {
  }
  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }
  saveClose() {
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
