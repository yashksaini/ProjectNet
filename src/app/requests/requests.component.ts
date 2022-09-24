import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  currentUser: any;
  requests: number = 0;
  allRequests: any[] = [];
  requested: any[] = [];
  connectionId: any[] = [];
  conn: any[] = [];
  all_conn: any[] = [];
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
        this.allRequests = querySnapshot.docs;
        for (let conn of this.allRequests) {
          this.requested.push(conn.data().user_send);
          this.connectionId.push(conn.data().connection_id);
        }
      })
      .then(() => {
        for (let i = 0; i < this.requested.length; i++) {
          firebase
            .firestore()
            .collection('profile')
            .where('id', '==', this.requested[i])
            .get()
            .then((querySnapshot) => {
              this.conn = querySnapshot.docs;
              for (let user of this.conn) {
                user = user.data();
                this.all_conn.push(user);
                this.all_conn[i].connection = this.connectionId[i];
              }
            });
        }
      });
  }
  aprove(id: any) {
    firebase
      .firestore()
      .collection('connection')
      .doc(id)
      .update({
        status: true,
      })
      .then(() => {
        alert('Added to connection');
        window.location.reload();
      });
  }
  ngOnInit(): void {}
}
