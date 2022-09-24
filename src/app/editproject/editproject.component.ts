import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-editproject',
  templateUrl: './editproject.component.html',
  styleUrls: ['./editproject.component.css'],
})
export class EditprojectComponent implements OnInit {
  message: string = '';
  message2: string = '';
  projectData: any[] = [];
  editorConfig: any;
  // Project Submission details
  p_level: string = '';
  p_link: string = '';
  p_name: string = '';
  p_main_lang: string = '';
  about_det: string = '';
  all_lang: string = '';
  key_feature: string = '';
  project_id: any = '';
  constructor(public activatedRoute: ActivatedRoute, public router: Router) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.project_id = id;

    firebase
      .firestore()
      .collection('projects')
      .where('p_id', '==', id)
      .get()
      .then((querySnapshot) => {
        this.projectData = querySnapshot.docs;
        for (let project of this.projectData) {
          this.p_name = project.data().project_name;
          this.p_link = project.data().link;
          this.p_level = project.data().level;
          this.p_main_lang = project.data().main_lang;
          this.about_det = project.data().about;
          this.all_lang = project.data().all_lang;
          this.key_feature = project.data().key_features;
        }
      });

    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '80px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: false,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText',
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadUrl: 'v1/image',
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
    };
  }
  onSubmit($event: any) {
    this.message = 'Uploading Image ...';
    firebase
      .storage()
      .ref(`/project/${this.project_id}`)
      .child('projectImg')
      .put($event.target.files[0])
      .then(() => {
        firebase
          .storage()
          .ref(`/project/${this.project_id}`)
          .child('projectImg')
          .getDownloadURL()
          .then((url) => {
            firebase
              .firestore()
              .collection('projects')
              .doc(this.project_id)
              .update({
                img_url: url,
              })
              .then(() => {
                alert('Image updated successfully.');
                this.router.navigate(['profile/']);
              });
          });
      });
  }
  ngOnInit(): void {}
  updateProject() {
    this.message2 = 'Updating Project....';
    firebase
      .firestore()
      .collection('projects')
      .doc(this.project_id)
      .update({
        project_name: this.p_name.toUpperCase(),
        about: this.about_det,
        all_lang: this.all_lang.toUpperCase(),
        main_lang: this.p_main_lang.toUpperCase(),
        level: this.p_level,
        link: this.p_link,
        key_features: this.key_feature,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert('Project updated successfully.');
        this.router.navigate(['profile/']);
      });
  }
}
