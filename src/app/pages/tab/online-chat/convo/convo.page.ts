import { ChatService } from 'src/app/services/chat/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {  IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-convo',
  templateUrl: './convo.page.html',
  styleUrls: ['./convo.page.scss'],
})
export class ConvoPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';

  constructor(private chatService: ChatService,
              private router: Router) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg).then(() =>{
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

}
