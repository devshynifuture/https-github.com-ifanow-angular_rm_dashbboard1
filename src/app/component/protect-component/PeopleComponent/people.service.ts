import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpService) { }




  // commmented code which are giving error =>>>>>>>>>>>


  getClientList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_PEOPLE_CLIENT_LIST, data, 1)
  }
  addClient(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.ADD_CLIENT, data)
  }
  editClient(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.EDIT_CLIENT, data);
  }
  addEditClientAddress(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.ADD_EDIT_CLIENT_ADDRESS, data);
  }
  addEditClientBankDetails(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.ADD_EDIT_CLIENT_BANK, data);
  }
  addEditClientDemat(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.ADD_EDIT_CLIENT_DEMAT, data);
  }
  addFamilyMember(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.ADD_FAMILY_MEMBER, data);
  }
  addMultipleFamilyMembers(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.ADD_MULTIPLE_FAMILY_MEMBERS, data);
  }
  editFamilyMemberDetails(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.EDIT_FAMILY_MEMBER_BASIC_DETAILS_MORE_INFO, data);
  }


  // commented Code closed which are giving error ->>>>>>>>>>>>>
}
