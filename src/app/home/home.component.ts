import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: any;
  constructor(public router: Router) {
    firebase.auth().onAuthStateChanged((user) => {
      let verify = firebase.auth().currentUser?.emailVerified;
      if (verify) {
        let curr_user = firebase.auth().currentUser;
        this.router.navigate(['profile/' + curr_user?.uid]);
      }
    });
  }

  ngOnInit(): void {}
}
