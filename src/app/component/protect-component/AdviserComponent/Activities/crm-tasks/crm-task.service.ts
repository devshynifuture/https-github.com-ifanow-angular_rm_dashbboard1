import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../http-service/http-service';
import { apiConfig } from '../../../../../config/main-config';
import { appConfig } from '../../../../../config/component-config';

@Injectable({
  providedIn: 'root',
})
export class CrmTaskService {
  constructor(
    private http: HttpService
  ) { }

  // apis calls

  // get calls

  getAllTaskListValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ACTIVITY_GET_ALL_TASK_LIST, data);
  }

  getTaskStatusValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ACTIVITY_GET_ALL_TASK_STATUS_LIST, data)
  }
  getTaskTemplateList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ACTIVITY_TASK_GET_TASK_TEMPLATE_LIST, data);
  }

  getIndividualTaskTemplate(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ACTIVITY_TASK_GET_INDIVIDUAL_TASK_TEMPLATE, data);
  }

  getAttachmentUploadUrlValue(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ACTIVITY_ADD_ATTACHMENT_UPLOAD_URL_GET, data);
  }

  getAttachmentDownloadOfTaskSubTask(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ACTIVITY_GET_ATTACHMENT_DOWNLOAD_OF_TASK_SUBTASK, data);
  }


  // post calls

  addTask(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ACTIVITY_ADD_TASK, data);
  }

  addSubTaskActivity(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ACTIVITY_TASK_SUBTASK_ADD, data)
  }

  addCollaboratorToTask(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ACTIVITY_TASK_ADD_COLLABORATOR, data)
  }

  addAttachmentTaskSubTask(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ACTIVITY_ADD_TASK_SUBTASK_ATTACHMENT, data);
  }

  addCommentOnActivityTaskOrSubTask(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ACTIVITY_ADD_COMMENT_TASK_SUBTASK, data);
  }


  // put calls

  editActivityTask(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_TASK_EDIT, data);
  }

  saveEditedCommentOnActivityTaskOrSubTask(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_EDIT_COMMENT_TASK_SUBTASK, data);
  }

  saveEditedSubTaskValues(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_SUBTASK_EDIT, data);
  }

  deleteActivityTask(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_DELETE_TASK, data);
  }

  deleteAttachmentTaskSubTask(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_DELETE_ATTACHMENT_TASK_SUBTASK, data);
  }

  deleteCommentTaskSubTask(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_DELETE_COMMENT_TASK_SUBTASK, data);
  }

  deleteCollaboratorFromTask(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_DELETE_COLLABORATOR_FROM_TASK, data);
  }

  deleteSubTaskFromTask(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_DELETE_SUBTASK_FROM_TASK, data);
  }

  markTaskOrSubTaskDone(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_MARK_TASK_OR_SUBTASK_DONE, data);
  }

}