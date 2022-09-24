import { removeSummaryDuplicates } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-searchuser',
  templateUrl: './searchuser.component.html',
  styleUrls: ['./searchuser.component.css'],
})
export class SearchuserComponent implements OnInit {
  search_u: string = '';
  displayString: string = '';
  users: any = '';
  users1: any = '';
  current: any[] = [];
  currentUser: any;
  search_res: string = '2';
  placeholder_value: string = 'Project Name, Project Language. .';
  value_get: string = '2';
  all_names: string[] = [];
  matches: string[] = [];
  loggedIn: boolean = false;
  user: any;
  // For project search variables

  matches1: string[] = [];
  all_names1: string[] = [];
  all_names2: string[] = [];
  current1: any[] = [];
  users2: any = '';
  matches2: string[] = [];
  projectIds: any[] = [];

  constructor() {
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    this.currentUser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection('profile')
      .get()
      .then((querySnapshot) => {
        this.users = querySnapshot.docs;
        for (let user of this.users) {
          user = user.data().name;
          /* To Store every value in the array */
          this.all_names.push(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // Getting all project names
    firebase
      .firestore()
      .collection('projects')
      .get()
      .then((querySnapshot) => {
        this.users2 = querySnapshot.docs;
        for (let user of this.users2) {
          user = user.data().project_name;
          /* To Store every value in the array */
          this.all_names1.push(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // Getting all project with languages
    firebase
      .firestore()
      .collection('projects')
      .get()
      .then((querySnapshot) => {
        this.users2 = querySnapshot.docs;
        for (let user of this.users2) {
          user = user.data().all_lang;
          /* To Store every value in the array */
          this.all_names2.push(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  change1() {
    if (this.search_res === '1') {
      this.placeholder_value = 'Search for any user. .';
      this.value_get = '1';
      this.search();
    } else {
      this.placeholder_value = 'Project Name, Project Language. .';
      this.value_get = '2';
      this.search();
    }
  }
  search() {
    this.current = [];
    this.current1 = [];
    this.displayString = this.search_u;
    // For Users
    if (this.value_get === '1') {
      if (this.search_u.length > 0) {
        this.matches = this.all_names.filter((s) =>
          s.includes(this.search_u.toUpperCase())
        );
        this.matches = this.matches.filter(this.onlyUnique);

        for (let i = 0; i < this.matches.length; i++) {
          firebase
            .firestore()
            .collection('profile')
            .where('name', '==', this.matches[i])
            .get()
            .then((querySnapshot) => {
              this.users1 = querySnapshot.docs;
              for (let user of this.users1) {
                user = user.data();
                /* To Store every value in the array */
                this.current.push(user);
              }
              for (let i = 0; i < this.current.length; i++) {
                // Getting all connections
                firebase
                  .firestore()
                  .collection('connection')
                  .where('user_send', '==', this.current[i].id)
                  .where('status', '==', true)
                  .get()
                  .then((querySnapshot) => {
                    let a = querySnapshot.docs.length;
                    // Getting the remaining connections
                    firebase
                      .firestore()
                      .collection('connection')
                      .where('user_rec', '==', this.current[i].id)
                      .where('status', '==', true)
                      .get()
                      .then((querySnapshot) => {
                        let b = querySnapshot.docs.length;
                        this.current[i].totalConnections = a + b;

                        firebase
                          .firestore()
                          .collection('projects')
                          .where('owner', '==', this.current[i].id)
                          .get()
                          .then((querySnapshot) => {
                            this.current[i].totalProjects =
                              querySnapshot.docs.length;
                          });
                      });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
    // For Projects
    else {
      if (this.search_u.length > 0) {
        this.matches1 = this.all_names1.filter((s) =>
          s.includes(this.search_u.toUpperCase())
        );
        this.matches2 = this.all_names2.filter((s) =>
          s.includes(this.search_u.toUpperCase())
        );
        this.matches1 = this.matches1.filter(this.onlyUnique);
        this.matches2 = this.matches2.filter(this.onlyUnique);

        // Getting Project Data with Project Name
        for (let i = 0; i < this.matches1.length; i++) {
          if (i == 100 && this.loggedIn) {
            break;
          }
          if (i == 10 && !this.loggedIn) {
            break;
          }
          firebase
            .firestore()
            .collection('projects')
            .where('project_name', '==', this.matches1[i])
            .get()
            .then((querySnapshot) => {
              this.users2 = querySnapshot.docs;
              for (let user of this.users2) {
                user = user.data();
                /* To Store every value in the array */
                this.current1.push(user);
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
                    this.current1[i].totalLikes = likes;
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
                    this.current1[i].totalComments = comments;
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        // Getting project data with languages used
        for (let i = 0; i < this.matches2.length; i++) {
          if (i == 100 && this.loggedIn) {
            break;
          }
          if (i == 10 && !this.loggedIn) {
            break;
          }
          firebase
            .firestore()
            .collection('projects')
            .where('all_lang', '==', this.matches2[i])
            .get()
            .then((querySnapshot) => {
              this.users2 = querySnapshot.docs;
              for (let user of this.users2) {
                user = user.data();
                /* To Store every value in the array */
                this.current1.push(user);
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
                    this.current1[i].totalLikes = likes;
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
                    this.current1[i].totalComments = comments;
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  }

  onlyUnique(value: string, index: number, self: any) {
    return self.indexOf(value) === index;
  }
  ngOnInit(): void {}
}
