import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-personal-profile',
  templateUrl: './add-personal-profile.component.html',
  styleUrls: ['./add-personal-profile.component.scss']
})
export class AddPersonalProfileComponent implements OnInit {

  constructor() { }
  imgURL: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png'
  imageUploadEvent: any = '';
  finalImage: any;

  ngOnInit() {
  }

  uploadImageForCorping(event:any) {
    this.imageUploadEvent = event;
  }
}
