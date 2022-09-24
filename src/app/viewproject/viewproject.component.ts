import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-viewproject',
  templateUrl: './viewproject.component.html',
  styleUrls: ['./viewproject.component.css'],
})
export class ViewprojectComponent implements OnInit {
  currentUser: any;
  likeById: any[] = [];
  currentProfile: boolean = false;
  project_id_url: any = '';
  projectData: any[] = [];
  likesData: any[] = [];
  profileData: any[] = [];
  totalLikes: number = 0;
  projectOwnerId: string = '';
  stars: string = '';
  projectLevel = ['Beginner', 'Intermediate', 'Advanced'];
  showLevel: string = '';
  keySkills: string = '';
  likeButton: string = "<i class='far fa-heart'></i>";
  likeDisabled: boolean = false;
  totalcomment: number = 0;
  currentURL: any;
  constructor(public activatedRoute: ActivatedRoute, public router: Router) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.project_id_url = id;
    this.currentUser = firebase.auth().currentUser;
    this.currentURL = window.location.href;
    if (id === this.currentUser.uid) {
      this.currentProfile = true;
    }
    this.commentCount();
    firebase
      .firestore()
      .collection('projects')
      .where('p_id', '==', id)
      .get()
      .then((querySnapshot) => {
        this.projectData = querySnapshot.docs;
        for (let profiledata of this.projectData) {
          this.projectOwnerId = profiledata.data().owner;
          this.showLevel = this.projectLevel[profiledata.data().level - 1];
          this.keySkills = profiledata.data().all_lang.split(',');
        }
      })
      .then(() => {
        firebase
          .firestore()
          .collection('profile')
          .where('id', '==', this.projectOwnerId)
          .get()
          .then((querySnapshot) => {
            this.profileData = querySnapshot.docs;
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    firebase
      .firestore()
      .collection('projects')
      .doc(this.project_id_url)
      .collection('likes')
      .where('projectId', '==', id)
      .get()
      .then((querySnapshot) => {
        this.likesData = querySnapshot.docs;
        this.totalLikes = querySnapshot.docs.length;
        for (let likeBy of this.likesData) {
          this.likeById.push(likeBy.data().likedBy);
        }
        let a = this.likeById.indexOf(this.currentUser.uid);
        if (a != -1) {
          this.likeButton = "<i class='fas fa-heart'></i>";
          this.likeDisabled = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  deleteProject(id: any) {
    firebase
      .firestore()
      .collection('projects')
      .doc(id)
      .delete()
      .then(() => {
        firebase
          .firestore()
          .collection('projects')
          .doc(id)
          .collection('likes')
          .doc()
          .delete();
      });
  }
  likesUpdate() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    firebase
      .firestore()
      .collection('projects')
      .doc(this.project_id_url)
      .collection('likes')
      .where('projectId', '==', id)
      .get()
      .then((querySnapshot) => {
        this.likesData = querySnapshot.docs;
        this.totalLikes = querySnapshot.docs.length;
        for (let likeBy of this.likesData) {
          this.likeById.push(likeBy.data().likedBy);
        }
        let a = this.likeById.indexOf(this.currentUser.uid);
        if (a != -1) {
          this.likeButton = "<i class='fas fa-heart'></i>";
          this.likeDisabled = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  commentCount() {
    firebase
      .firestore()
      .collection('projects')
      .doc(this.project_id_url)
      .collection('comments')
      .where('projectId', '==', this.project_id_url)
      .get()
      .then((querySnapshot) => {
        this.totalcomment = querySnapshot.docs.length;
      });
  }
  ngOnInit(): void {}
  likeAdd() {
    firebase
      .firestore()
      .collection('projects')
      .doc(this.project_id_url)
      .collection('likes')
      .doc()
      .set({
        owner: this.projectOwnerId,
        likedBy: this.currentUser.uid,
        projectId: this.project_id_url,
      })
      .then(() => {
        this.likesUpdate();
      });
  }
}
