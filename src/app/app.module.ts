import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './editprofile/editprofile.component';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { SearchuserComponent } from './searchuser/searchuser.component';
import { AddprojectComponent } from './addproject/addproject.component';
import { ViewprojectComponent } from './viewproject/viewproject.component';
import { EditprojectComponent } from './editproject/editproject.component';
import { ConnectionComponent } from './connection/connection.component';
import { RequestsComponent } from './requests/requests.component';
import { SentsComponent } from './sents/sents.component';
import { CommentComponent } from './comment/comment.component';

const firebaseConfig = {
  apiKey: 'AIzaSyC-kClWdgV31JKqKRdmMnAodj5uRvUF6_8',
  authDomain: 'projectnet-b4b88.firebaseapp.com',
  projectId: 'projectnet-b4b88',
  storageBucket: 'projectnet-b4b88.appspot.com',
  messagingSenderId: '732401035601',
  appId: '1:732401035601:web:bf77b96fc79206870bcb70',
  measurementId: 'G-Q0PEXS6BN1',
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    EditprofileComponent,
    SearchuserComponent,
    AddprojectComponent,
    ViewprojectComponent,
    EditprojectComponent,
    ConnectionComponent,
    RequestsComponent,
    SentsComponent,
    CommentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularEditorModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
