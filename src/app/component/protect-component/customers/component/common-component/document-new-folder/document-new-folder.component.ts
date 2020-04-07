import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  parentId: any;
  showSpinner = false

  constructor(private custumService: CustomerService,
    public dialogRef: MatDialogRef<DocumentNewFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private eventService:EventService) {}

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.folderUpload = this.data.animal;
    this.folderName = this.data.name;
    this.parentId=this.data.parentId;
     this.rename(this.folderName);
  }

  createNewFolder(value){
   console.log(this.nameFolder)
   this.showSpinner = true


    if(this.folderUpload!='CREATE'){
   let obj ={
     newFolder : value, rename: this.SendObj
   }
   this.close(true,obj)
    }else{
      const obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        folderParentId: (this.data.parentId == undefined) ? 0 : this.parentId,
        folderName: value
      };
      this.custumService.newFolder(obj).subscribe(
        data => this.newFolderRes(data)
      );
    }

  }
  newFolderRes(data){
    this.showSpinner = false
    console.log(data)
    if(data==204){
      this.eventService.openSnackBar('Folder name already exist', 'Ok');
    }else{
      let obj ={
        newFolder : this.nameFolder, rename: this.SendObj
      }
       this.close(true,obj)
    }
    
  }
  rename(value){
    this.nameFolder = (value.fileName == undefined)? value.folderName : value.fileName
    this.reameValue = (value.fileName == undefined)? 'folderName' : 'fileName'
    this.SendObj = { name : this.nameFolder, flag : this.reameValue, value: value}
  }
  close(flag,obj) {
    this.dialogRef.close({ isRefreshRequired: flag,data:obj })
  }
}

export interface DialogData {
  parentId: any;
  animal: string;
  name: string;
}