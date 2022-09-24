import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileData: any[] = [];
  projectData: any[] = [];
  conData: any[] = [];
  keySkills: string = '';
  curr_conn_id: string = '';
  req_status: boolean = false;
  currentProfile: boolean = false;
  showConnect: boolean = true;
  totalProjects: number = 0;
  total: number = 0;
  totalLikes: number = 0;
  totalComments: number = 0;
  projectId: string = '';

  projectsData: any[] = [];
  projectIds: any[] = [];
  currentURL: any;

  constructor(public activatedRoute: ActivatedRoute, private router: Router) {
    this.currentURL = window.location.href;
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.show_data();
      }
    });
  }
  show_data() {
    let getId = this.activatedRoute.snapshot.paramMap.get('id');
    let id = getId?.split('#')[0];
    let user = firebase.auth().currentUser;
    if (id === user?.uid) {
      this.currentProfile = true;
    }
    firebase
      .firestore()
      .collection('connection')
      .where('user_send', '==', user?.uid)
      .where('user_rec', '==', id)
      .get()
      .then((querySnapshot) => {
        this.conData = querySnapshot.docs;
        let a = querySnapshot.docs.length;
        if (a === 1) {
          this.showConnect = false;
        }
        for (let conn of this.conData) {
          this.req_status = conn.data().status;
          this.curr_conn_id = conn.data().connection_id;
        }
      });

    firebase
      .firestore()
      .collection('connection')
      .where('user_send', '==', id)
      .where('user_rec', '==', user?.uid)
      .get()
      .then((querySnapshot) => {
        this.conData = querySnapshot.docs;
        let a = querySnapshot.docs.length;
        if (a === 1) {
          this.showConnect = false;
        }
        for (let conn of this.conData) {
          this.req_status = conn.data().status;
          this.curr_conn_id = conn.data().connection_id;
        }
      });
    firebase
      .firestore()
      .collection('profile')
      .where('id', '==', id)
      .get()
      .then((querySnapshot) => {
        this.profileData = querySnapshot.docs;
        for (let profile of this.profileData) {
          this.keySkills = profile.data().keySkills.split(',');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // Getting likes and comment on each project
    firebase
      .firestore()
      .collection('projects')
      .where('owner', '==', id)
      .orderBy('created', 'desc')
      .get()
      .then((querySnapshot) => {
        this.totalProjects = querySnapshot.docs.length;
        this.projectsData = querySnapshot.docs;
        for (let user of this.projectsData) {
          user = user.data();
          this.projectData.push(user);
          this.projectIds.push(user.p_id);
        }
        // For likes
        for (let i = 0; i < this.projectIds.length; i++) {
          firebase
            .firestore()
            .collection('projects')
            .doc(this.projectIds[i])
            .collection('likes')
            .get()
            .then((querySnapshot) => {
              let likes = querySnapshot.docs.length;
              this.projectData[i].totalLikes = likes;
              this.totalLikes += likes;
            });
        }
        // for comments
        for (let i = 0; i < this.projectIds.length; i++) {
          firebase
            .firestore()
            .collection('projects')
            .doc(this.projectIds[i])
            .collection('comments')
            .get()
            .then((querySnapshot) => {
              let comments = querySnapshot.docs.length;
              this.projectData[i].totalComments = comments;
              this.totalComments += comments;
            });
        }
      });

    // Getting all connections
    firebase
      .firestore()
      .collection('connection')
      .where('user_send', '==', id)
      .where('status', '==', true)
      .get()
      .then((querySnapshot) => {
        this.conData = querySnapshot.docs;
        let a = querySnapshot.docs.length;
        // Getting the remaining connections
        firebase
          .firestore()
          .collection('connection')
          .where('user_rec', '==', id)
          .where('status', '==', true)
          .get()
          .then((querySnapshot) => {
            this.conData = querySnapshot.docs;
            let b = querySnapshot.docs.length;
            this.total = a + b;
          });
      });
  }

  con_req() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    let user = firebase.auth().currentUser;
    let conn_id = Math.random().toString(36).substr(2, 8);
    firebase
      .firestore()
      .collection('connection')
      .doc(conn_id)
      .set({
        user_send: user?.uid,
        user_rec: id,
        status: false,
        connection_id: conn_id,
      })
      .then(() => {
        alert('Request Sent');
        this.show_data();
      });
  }
  drop_req() {
    firebase
      .firestore()
      .collection('connection')
      .doc(this.curr_conn_id)
      .delete()
      .then(() => {
        alert('Connection Removed');
        this.req_status = false;
        this.showConnect = true;
        this.show_data();
      });
  }
  ngOnInit(): void {}
}
