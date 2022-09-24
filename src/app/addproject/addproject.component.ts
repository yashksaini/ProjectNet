import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { Router } from '@angular/router';

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css'],
})
export class AddprojectComponent implements OnInit {
  editorConfig: any;
  currentUser: any = [];
  profileData: any[] = [];
  c_name: string = '';

  // Project Submission details
  p_level: string = '';
  p_link: string = '';
  p_name: string = '';
  p_main_lang: string = '';
  about_det: string = '';
  all_lang: string = '';
  key_feature: string = '';
  p_img: string =
    'https://firebasestorage.googleapis.com/v0/b/projectnet-b4b88.appspot.com/o/profileImages%2Fproject_image.png?alt=media&token=5601514f-5bcf-4bc5-bcd6-c291f8a28cd0';
  constructor(public router: Router) {
    this.currentUser = firebase.auth().currentUser;

    firebase
      .firestore()
      .collection('profile')
      .where('id', '==', this.currentUser.uid)
      .get()
      .then((querySnapshot) => {
        this.profileData = querySnapshot.docs;
        for (let profile of this.profileData) {
          this.c_name = profile.data().name;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '100px',
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
  addProject() {
    let project_id = Math.random().toString(36).substr(2, 8);
    firebase
      .firestore()
      .collection('projects')
      .doc(project_id)
      .set({
        owner: this.currentUser.uid,
        p_id: project_id,
        project_name: this.p_name.toUpperCase(),
        about: this.about_det,
        all_lang: this.all_lang.toUpperCase(),
        main_lang: this.p_main_lang.toUpperCase(),
        level: this.p_level,
        link: this.p_link,
        img_url: this.p_img,
        key_features: this.key_feature,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        // To add likes to the given project
        firebase
          .firestore()
          .collection('projects')
          .doc(project_id)
          .collection('likes')
          .doc()
          .set({
            owner: this.currentUser.uid,
            likedBy: this.currentUser.uid,
            projectId: project_id,
          });
        // To add comments to the given project
        firebase
          .firestore()
          .collection('projects')
          .doc(project_id)
          .collection('comments')
          .doc()
          .set({
            owner: this.currentUser.uid,
            commentBy: this.currentUser.uid,
            projectId: project_id,
            comment: 'Added the project',
            created: firebase.firestore.FieldValue.serverTimestamp(),
          });
        alert(
          'Project added successfully. You can  add project image in project edit.'
        );
        this.router.navigate(['profile/']);
      });
  }
  ngOnInit(): void {}
}
