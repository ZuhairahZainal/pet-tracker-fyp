/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {AngularFirestore, } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.page.html',
  styleUrls: ['./add-reminder.page.scss'],
})
export class AddReminderPage implements OnInit {

  newReminder: FormGroup;
  value: any;
  name: any;

  newReminderDetails ={
    time: new Date().getTime(),
    date: new Date().toDateString(),
    reminderId:'',
    reminderType:'',
    descriptionReminder:'',
    repeat:'',
    dayType:'',
    userId: '',
    userName: '',
  };

  userId: string;

  constructor(
    private router: Router,
    private firebaseData: AngularFirestore,) {

    }

  ngOnInit() {
    this.getUserId();

      this.newReminder= new FormGroup({
        reminderId: new FormControl(this.newReminderDetails.reminderId,[
          Validators.required,
      ]),
      reminderType: new FormControl(this.newReminderDetails.reminderType,[
        Validators.required,
      ]),
      descriptionReminder: new FormControl(this.newReminderDetails.descriptionReminder,[
      ]),
      repeat: new FormControl(this.newReminderDetails.repeat,[
        Validators.required,
      ]),
      dayType: new FormControl(this.newReminderDetails.dayType,[
        Validators.required,
      ])
  });
 }

 getUserId(){
  const user = firebase.auth().currentUser;

  this.newReminderDetails.userId = `${user.uid}`;
  this.userId = user.uid;

  this.firebaseData.collection('users').doc(this.userId).valueChanges().subscribe( userDetail => {
    this.newReminderDetails.userName = userDetail['name'];
  });
}

submitIt(): void{

  this.newReminderDetails.reminderId= this.firebaseData.createId();
    this.newReminderDetails.reminderType = this.newReminder.get('reminderType').value;
    this.newReminderDetails.descriptionReminder = this.newReminder.get('descriptionReminder').value;
    this.newReminderDetails.dayType = this.newReminder.get('dayType').value;
    this.newReminderDetails.repeat = this.newReminder.get('repeat').value;

    this.firebaseData.collection('users').doc(this.userId).collection('newReminder').doc(this.newReminderDetails.reminderId).set({
      reminderId : this.newReminderDetails.reminderId,
      reminderType: this.newReminderDetails.reminderType,
      descriptionReminder: this.newReminderDetails.descriptionReminder,
      repeat: this.newReminderDetails.repeat,
      dayType: this.newReminderDetails.dayType

    }).then(() => {
      this.newReminder= null; // Clears all the inputs
      this.router.navigateByUrl('/tab/location-tracker/pet-profile');//
      console.log('New Reminder just added!');
    });

// console.log('Error. Please Try Again');

}
// Deletes itesm from list
 deleteReminder(){
   return this.firebaseData
   .collection('newReminderDetails')
   .doc('reminderId')
   .delete();
 }





}


