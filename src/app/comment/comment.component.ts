import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  currentUser: any;
  projectId: any;
  projectData: any[] = [];
  projectOwnerId: string = '';
  comment_text: string = '';
  commentData: any[] = [];
  userProfiles: any[] = [];
  conn: any[] = [];
  totalcomments: number = 0;
  constructor(public activatedRoute: ActivatedRoute, public router: Router) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.projectId = id;
    this.currentUser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection('projects')
      .where('p_id', '==', id)
      .get()
      .then((querySnapshot) => {
        this.projectData = querySnapshot.docs;
        for (let profiledata of this.projectData) {
          this.projectOwnerId = profiledata.data().owner;
        }
      });
    this.getComments();
  }
  getComments() {
    firebase
      .firestore()
      .collection('projects')
      .doc(this.projectId)
      .collection('comments')
      .orderBy('created', 'desc')
      .where('projectId', '==', this.projectId)
      .get()
      .then((querySnapshot) => {
        this.conn = querySnapshot.docs;
        this.totalcomments = querySnapshot.docs.length;
        for (let user of this.conn) {
          user = user.data();
          this.commentData.push(user);
          this.userProfiles.push(user.commentBy);
        }
        for (let i = 0; i < this.userProfiles.length; i++) {
          firebase
            .firestore()
            .collection('profile')
            .where('id', '==', this.userProfiles[i])
            .get()
            .then((querySnapshot) => {
              let profileData = querySnapshot.docs;
              for (let comments of profileData) {
                this.commentData[i].name = comments.data().name.toLowerCase();
              }
            });
        }
      });
  }

  addComment() {
    firebase
      .firestore()
      .collection('projects')
      .doc(this.projectId)
      .collection('comments')
      .doc()
      .set({
        owner: this.projectOwnerId,
        commentBy: this.currentUser.uid,
        projectId: this.projectId,
        comment: this.comment_text,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        this.comment_text = '';
        this.userProfiles = [];
        this.commentData = [];
        this.getComments();
      });
  }

  ngOnInit(): void {}
}
