import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
})
export class EditprofileComponent implements OnInit {
  message: string = '';
  editorConfig: any;
  profileData: any[] = [];
  keySkills: string = '';
  newImage: any = [];
  name: string = '';
  linkedIn_link: string = '';
  twitter_link: string = '';
  about_det: string = '';
  keyskills_det: string = '';
  message2: string = '';
  userEmail: string = '';
  messageForReset: string = '';
  user = firebase.auth().currentUser;
  constructor(public router: Router) {
    firebase
      .firestore()
      .collection('profile')
      .where('id', '==', this.user?.uid)
      .get()
      .then((querySnapshot) => {
        this.profileData = querySnapshot.docs;
        for (let profile of this.profileData) {
          this.keySkills = profile.data().keySkills.split(',');
          this.about_det = profile.data().about;
          this.keyskills_det = profile.data().keySkills;
          this.name = profile.data().name.toUpperCase();
          this.linkedIn_link = profile.data().linkedIn;
          this.twitter_link = profile.data().twitter;
          this.userEmail = profile.data().email;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  passwordChange() {
    firebase
      .auth()
      .sendPasswordResetEmail(this.userEmail)
      .then(() => {
        this.messageForReset =
          'Email is successfully sent for password change. Check the spam in your mail.';
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }
  onSubmit($event: any) {
    this.message = 'Uploading Image ...';
    firebase
      .storage()
      .ref(`/profile/${this.user?.uid}`)
      .child('avatar')
      .put($event.target.files[0])
      .then(() => {
        firebase
          .storage()
          .ref(`/profile/${this.user?.uid}`)
          .child('avatar')
          .getDownloadURL()
          .then((url) => {
            firebase
              .firestore()
              .collection('profile')
              .doc(this.user?.uid)
              .update({
                imageURL: url,
              })
              .then(() => {
                window.location.reload();
              });
          });
      });
  }
  update() {
    this.message2 = 'Updating Profile....';
    firebase
      .firestore()
      .collection('profile')
      .doc(this.user?.uid)
      .update({
        about: this.about_det,
        linkedIn: this.linkedIn_link,
        twitter: this.twitter_link,
        name: this.name.toUpperCase(),
        keySkills: this.keyskills_det,
      })
      .then(() => {
        window.location.href = 'profile/' + this.user?.uid;
      });
  }
  ngOnInit(): void {}
}
