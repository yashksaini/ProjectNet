import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  message: string = '';
  userError: string = '';
  myForm: FormGroup;
  constructor(public fb: FormBuilder, public router: Router) {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit(signupform: any) {
    let email: string = signupform.value.email;
    let password: string = signupform.value.password;
    let firstName: string = signupform.value.firstName;
    let lastName: string = signupform.value.lastName;
    let full_name: string = firstName + ' ' + lastName;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        let user = firebase.auth().currentUser;
        console.log(user?.uid);
        firebase
          .firestore()
          .collection('profile')
          .doc(user?.uid)
          .set({
            name: full_name.toUpperCase(),
            id: user?.uid,
            about: ' ',
            keySkills: ' ',
            linkedIn: '',
            twitter: '',
            email: user?.email,
            imageURL:
              'https://firebasestorage.googleapis.com/v0/b/projectnet-b4b88.appspot.com/o/profileImages%2Fprofile.png?alt=media&token=63aff148-8cde-4325-9654-770851f77db4',
          })
          .then(() => {
            console.log('New User Data added');
            this.myForm.reset();
            firebase.auth().signOut();
          });
        user?.sendEmailVerification();
        this.message =
          'You are successfully signed up. Please verify email to login.';
      })
      .catch((error) => {
        this.userError = error.message;
      });
  }
  ngOnInit(): void {}
}
