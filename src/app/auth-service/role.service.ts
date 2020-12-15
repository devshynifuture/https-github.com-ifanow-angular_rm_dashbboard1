import { Router } from '@angular/router';
import { Injectable } from '@angular/core/src/metadata/*';
import { SettingsService } from '../component/protect-component/AdviserComponent/setting/settings.service';
import { UtilService } from '../services/util.service';
import { AuthService } from "./authService";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private utilService: UtilService,
    private authService: AuthService
  ) {
    if (authService.isLoggedIn()) {
      this.getRoleDetails(AuthService.getUserInfo().roleId);
    }
  }

  subscriptionPermission = {
    enabled: true,
    subModule: {
      subscriptions: {
        enabled: true,
        subscriptionsCapabilityList: []
      },
      quotations: {
        enabled: true,
        quotationsCapabilityList: []
      },
      documents: {
        enabled: true,
        documentsCapabilityList: []
      },
      dashboard: {
        enabled: true,
      },
      invoices: {
        enabled: true,
        invoicesCapabilityList: []
      },
      clients: {
        enabled: true,
        subModule: {
          subscriptions: {
            enabled: true
          },
          quotations: {
            enabled: true
          },
          documents: {
            enabled: true
          },
          invoices: {
            enabled: true
          },
          settings: {
            enabled: true
          },
          subscriptionsCapabilityList: [],
          quotationsCapabilityList: [],
          documentsCapabilityList: [],
          invoicesCapabilityList: [],
          settingsCapabilityList: []
        }
      },
      settings: {
        enabled: true,
        settingsCapabilityList: []
      }
    }
  };
  portfolioPermission = {
    enabled: true,
  };
  transactionPermission = {
    enabled: true,
  };
  peoplePermission = {
    enabled: true,
    subModule: {
      clients: {
        enabled: true,
      },
      leads: {
        enabled: true,
      },
      clientsCapability: [],
      leadsCapability: []
    }
  };
  backofficePermission = {
    enabled: true,
    subModule: {
      mis: {
        enabled: true,
      },
      fileuploads: {
        enabled: true,
      },
      duplicateData: {
        enabled: true,
      },
      foliomapping: {
        enabled: true,
      },
      folioquery: {
        enabled: true,
      },
      aumreconciliation: {
        enabled: true,
      },
      misCapability: {},
      fileuploadsCapability: {}
    }
  };
  dashboardPermission = {
    enabled: true,
  };
  activityPermission = {
    enabled: true,
    subModule: {
      tasks: {
        enabled: true
      },
      emails: {
        enabled: true
      },
      calendar: {
        enabled: true
      },
      taskCapabilityList: [],
      calendarCapabilityList: [],
      emailCapabilityList: []
    }
  };
  overviewPermission = {
    enabled: true,
  };
  planPermission = {
    enabled: true,
  };
  settingPermission = {
    enabled: true,
  };
  familyMemberId: any;
  dataModels = [];

  allPermissionData = new BehaviorSubject<any>({});

  getAllPermissionData() {
    return this.allPermissionData.asObservable();
  }

  getRoleDetails(roleId) {
    this.settingsService.getAdvisorOrClientOrTeamMemberRoles({ id: roleId }).subscribe((res) => {
      console.log('roleService getRoleDetails response : ', res);

      if (res) {
        this.allPermissionData.next(res);
        this.constructAdminDataSource(res);
        console.log('roleService getRoleDetails data : ', this.dataModels);
      }
    }, err => {
      console.log('roleService getRoleDetails err : ', err);
    });
  }

  constructAdminDataSource(adminDatasource) {
    for (const key in adminDatasource) {
      const subModules = adminDatasource[key];
      this.setPermissions(subModules.parentId, subModules.showModule);
      /* for (let i = 0; i < subModules.length; i++) {
         let segregated_permissions = this.utilService.segregateNormalAndAdvancedPermissions(subModules[i].capabilityList, subModules[i].childId);
         segregated_permissions = this.utilService.convertEnabledOrDisabledAsBoolean(segregated_permissions);
         delete subModules[i].capabilityList;
         subModules[i] = {
           ...subModules[i],
           ...segregated_permissions
         };
       }
       const obj = {
         modelName: subModules[0].parentName,
         subModules,
       };
       this.dataModels.push(obj);*/
    }
    this.setSubscriptionSubModulePermissions(adminDatasource.subscriptions.subModule);
    this.setPeoplePermissions(adminDatasource.people.subModule)
    this.setActivityPermissions(adminDatasource.activity.subModule);
    this.setBackofficePermissions(adminDatasource.backoffice.subModule)
  }

  setPermissions(moduleId, enabled) {
    console.log(' moduleId : ', moduleId, ' enabled : ', enabled);
    if (moduleId == 92) {
      this.subscriptionPermission.enabled = enabled;
    } else if (moduleId == 23) {
      this.portfolioPermission.enabled = enabled;
    } else if (moduleId == 3) {
      this.peoplePermission.enabled = enabled;
    } else if (moduleId == 115) {
      this.backofficePermission.enabled = enabled;
    } else if (moduleId == 1) {
      this.dashboardPermission.enabled = enabled;
    } else if (moduleId == 66) {
      this.activityPermission.enabled = enabled;
    } else if (moduleId == 74) {
      this.transactionPermission.enabled = enabled;
    } else if (moduleId == 8) {
      this.overviewPermission.enabled = enabled;
    } else if (moduleId == 42) {
      this.planPermission.enabled = enabled;
    } else if (moduleId == 122) {
      this.settingPermission.enabled = enabled;
    }
    // if (moduleName == 'Subscriptions') {
    //   this.subscriptionPermission.enabled = enabled;
    // } else if (moduleName == 'Portfolio') {
    //   this.portfolioPermission.enabled = enabled;
    // } else if (moduleName == 'People') {
    //   this.peoplePermission.enabled = enabled;
    // } else if (moduleName == 'Back office') {
    //   this.backofficePermission.enabled = enabled;
    // }
  }

  setSubscriptionSubModulePermissions(subscriptionPermissions) {
    this.subscriptionPermission.subModule.subscriptions.enabled = subscriptionPermissions.subscriptions ? subscriptionPermissions.subscriptions.showModule : false;
    this.subscriptionPermission.subModule.quotations.enabled = subscriptionPermissions.quotations ? subscriptionPermissions.quotations.showModule : false;
    this.subscriptionPermission.subModule.documents.enabled = subscriptionPermissions.documents ? subscriptionPermissions.documents.showModule : false;
    this.subscriptionPermission.subModule.dashboard.enabled = subscriptionPermissions.dashboard ? subscriptionPermissions.dashboard.showModule : false;
    this.subscriptionPermission.subModule.invoices.enabled = subscriptionPermissions.invoices ? subscriptionPermissions.invoices.showModule : false;
    this.subscriptionPermission.subModule.clients.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.showModule : false;
    this.subscriptionPermission.subModule.settings.enabled = subscriptionPermissions.settings ? subscriptionPermissions.settings.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.subscriptions.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.subscriptions.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.quotations.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.quotations.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.invoices.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.invoices.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.documents.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.documents.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.settings.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.settings.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.documentsCapabilityList = subscriptionPermissions.clients.subModule.documents.subModule.documents.capabilityList
    this.subscriptionPermission.subModule.clients.subModule.invoicesCapabilityList = subscriptionPermissions.clients.subModule.invoices.subModule.invoices.capabilityList
    this.subscriptionPermission.subModule.clients.subModule.subscriptionsCapabilityList = subscriptionPermissions.clients.subModule.subscriptions.subModule.subscriptions.capabilityList
    this.subscriptionPermission.subModule.clients.subModule.quotationsCapabilityList = subscriptionPermissions.clients.subModule.quotations.subModule.quotations.capabilityList
    this.subscriptionPermission.subModule.clients.subModule.settingsCapabilityList = subscriptionPermissions.clients.subModule.settings.subModule.settings.capabilityList
    this.subscriptionPermission.subModule.subscriptions.subscriptionsCapabilityList = subscriptionPermissions.subscriptions.subModule.subscriptions.capabilityList;
    this.subscriptionPermission.subModule.quotations.quotationsCapabilityList = subscriptionPermissions.quotations.subModule.quotations.capabilityList
    this.subscriptionPermission.subModule.invoices.invoicesCapabilityList = subscriptionPermissions.invoices.subModule.invoices.capabilityList
    this.subscriptionPermission.subModule.documents.documentsCapabilityList = subscriptionPermissions.documents.subModule.documents.capabilityList
  }

  setActivityPermissions(activityPermissions) {
    this.activityPermission.subModule.tasks.enabled = activityPermissions.tasks ? activityPermissions.tasks.showModule : false;
    this.activityPermission.subModule.emails.enabled = activityPermissions.emails ? activityPermissions.emails.showModule : false;
    this.activityPermission.subModule.calendar.enabled = activityPermissions.calendar ? activityPermissions.calendar.showModule : false;
    this.activityPermission.subModule.taskCapabilityList = activityPermissions.tasks.subModule.tasks.capabilityList;
    this.activityPermission.subModule.calendarCapabilityList = activityPermissions.calendar.subModule.calendar.capabilityList;
    this.activityPermission.subModule.emailCapabilityList = activityPermissions.emails.subModule.emails.capabilityList;
  }

  setPeoplePermissions(peoplePermission) {
    this.peoplePermission.subModule.clients.enabled = peoplePermission.clients.showModule;
    this.peoplePermission.subModule.leads.enabled = peoplePermission.leads.showModule;
    this.peoplePermission.subModule.clientsCapability = peoplePermission.clients.subModule.clients.capabilityList;
    this.peoplePermission.subModule.leadsCapability = peoplePermission.leads.subModule.leads.capabilityList;
  }

  setBackofficePermissions(backOfficePermission) {
    this.backofficePermission.subModule.mis.enabled = backOfficePermission.mis.showModule
    this.backofficePermission.subModule.fileuploads.enabled = backOfficePermission.fileuploads.showModule
    this.backofficePermission.subModule.duplicateData.enabled = backOfficePermission.duplicateData.showModule
    this.backofficePermission.subModule.foliomapping.enabled = backOfficePermission.foliomapping.showModule
    this.backofficePermission.subModule.folioquery.enabled = backOfficePermission.folioquery.showModule
    this.backofficePermission.subModule.aumreconciliation.enabled = backOfficePermission.aumreconciliation.showModule
    this.backofficePermission.subModule.misCapability = UtilService.getDetailedCapabilityMap(backOfficePermission.mis.subModule.mis.capabilityList);
    this.backofficePermission.subModule.fileuploadsCapability = UtilService.getDetailedCapabilityMap(backOfficePermission.fileuploads.subModule.fileuploads.capabilityList);
  }
}
