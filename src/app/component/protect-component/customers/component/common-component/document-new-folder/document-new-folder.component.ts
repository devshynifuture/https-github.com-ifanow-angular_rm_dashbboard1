import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer/customer.service';

@Component({
  selector: 'app-document-new-folder',
  templateUrl: './document-new-folder.component.html',
  styleUrls: ['./document-new-folder.component.scss']
})
export class DocumentNewFolderComponent implements OnInit {
  nameFolder: any;
  advisorId: any;
  clientId: any;
  folderName: string;
  folderUpload: string;
  SendObj: {};
  reameValue: string;

  constructor(private custumService: CustomerService,
    public dialogRef: MatDialogRef<DocumentNewFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.folderUpload = this.data.animal;
    this.folderName = this.data.name
     this.rename(this.folderName);
  }

  createNewFolder(value){
    console.log('folderName',value)
   console.log(this.nameFolder)
   let obj ={
     newFolder : value, rename: this.SendObj
   }
   this.dialogRef.close(obj)
  }
  rename(value){
    this.nameFolder = (value.fileName == undefined)? value.folderName : value.fileName
    this.reameValue = (value.fileName == undefined)? 'folderName' : 'fileName'
    this.SendObj = { name : this.nameFolder, flag : this.reameValue, value: value}
  }
}

export interface DialogData {
  animal: string;
  name: string;
}