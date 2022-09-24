import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  message: string = '';
  userError: string = '';
  myForm: FormGroup;

  loggedIn: boolean = false;
  user: any;
  step: any;
  urlsplit: any;
  links: string[] = ['search', 'network', 'project', 'profile', 'view'];
  urlEnd: any;
  constructor(public fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required]],
    });

    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        let x = window.location.href;
        this.urlsplit = x.split('/');
        let last = this.urlsplit[this.urlsplit.length - 1].split('#');
        this.step = this.links.indexOf(this.urlsplit[3]);
        this.urlEnd = last[0];
        if (this.links.indexOf(last[0]) == -1) {
          this.urlEnd =
            this.urlsplit[3] +
            '/' +
            this.urlsplit[this.urlsplit.length - 1].split('#')[0];
        }
      }
    });

    firebase.auth().onAuthStateChanged((user) => {
      let verify = firebase.auth().currentUser?.emailVerified;
      this.user = user;
      if (verify) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }
  onSubmit(signupform: any) {
    let email: string = signupform.value.email;
    console.log(email);
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.message =
          'Email is successfully sent for password reset. Check the spam in your mail.';
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.userError = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  ngOnInit() {}
  logout() {
    firebase.auth().signOut();
  }
}
