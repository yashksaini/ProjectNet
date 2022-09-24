import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css'],
})
export class ConnectionComponent implements OnInit {
  currentUser: any;
  conData: any[] = [];
  connections: any[] = [];
  all_conn: any[] = [];
  conn: any[] = [];
  showBox: boolean = false;
  total: number = 0;
  requests: number = 0;
  sents: number = 0;
  constructor() {
    this.currentUser = firebase.auth().currentUser;
    // Getting the total requests
    firebase
      .firestore()
      .collection('connection')
      .where('user_rec', '==', this.currentUser.uid)
      .where('status', '==', false)
      .get()
      .then((querySnapshot) => {
        this.requests = querySnapshot.docs.length;
      });

    // Getting the total sents
    firebase
      .firestore()
      .collection('connection')
      .where('user_send', '==', this.currentUser.uid)
      .where('status', '==', false)
      .get()
      .then((querySnapshot) => {
        this.sents = querySnapshot.docs.length;
      });

    // Getting all connections
    firebase
      .firestore()
      .collection('connection')
      .where('user_send', '==', this.currentUser.uid)
      .where('status', '==', true)
      .get()
      .then((querySnapshot) => {
        this.conData = querySnapshot.docs;
        let a = querySnapshot.docs.length;

        for (let conn of this.conData) {
          this.connections.push(conn.data().user_rec);
        }
        // Getting the remaining connections
        firebase
          .firestore()
          .collection('connection')
          .where('user_rec', '==', this.currentUser.uid)
          .where('status', '==', true)
          .get()
          .then((querySnapshot) => {
            this.conData = querySnapshot.docs;
            let b = querySnapshot.docs.length;
            this.total = a + b;
            if (a + b === 0) {
              this.showBox = true;
            }
            for (let conn of this.conData) {
              this.connections.push(conn.data().user_send);
            }
          })
          .then(() => {
            // Storing connection details in array
            for (let i = 0; i < this.connections.length; i++) {
              firebase
                .firestore()
                .collection('profile')
                .where('id', '==', this.connections[i])
                .get()
                .then((querySnapshot) => {
                  this.conn = querySnapshot.docs;
                  for (let user of this.conn) {
                    user = user.data();
                    this.all_conn.push(user);
                  }
                  // Each Connection Details
                  for (let i = 0; i < this.all_conn.length; i++) {
                    // Getting all connections
                    firebase
                      .firestore()
                      .collection('connection')
                      .where('user_send', '==', this.all_conn[i].id)
                      .where('status', '==', true)
                      .get()
                      .then((querySnapshot) => {
                        let a = querySnapshot.docs.length;
                        // Getting the remaining connections
                        firebase
                          .firestore()
                          .collection('connection')
                          .where('user_rec', '==', this.all_conn[i].id)
                          .where('status', '==', true)
                          .get()
                          .then((querySnapshot) => {
                            let b = querySnapshot.docs.length;
                            this.all_conn[i].totalConnections = a + b;

                            firebase
                              .firestore()
                              .collection('projects')
                              .where('owner', '==', this.all_conn[i].id)
                              .get()
                              .then((querySnapshot) => {
                                this.all_conn[i].totalProjects =
                                  querySnapshot.docs.length;
                              });
                          });
                      });
                  }
                });
            }
          });
      });
  }

  ngOnInit(): void {}
}
