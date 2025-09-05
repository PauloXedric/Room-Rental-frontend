import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatMessageService } from '@shared/_services';
import { ReadMessageModel, AddMessageModel } from '@shared/_models';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ScrollPanel } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar';

interface ExtendedMessage extends ReadMessageModel {
  isSentByCurrentUser: boolean;
}

@Component({
  selector: 'app-tenant-message',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    ScrollPanel,
    AvatarModule,
  ],
  templateUrl: './tenant-message.component.html',
  styleUrls: ['./tenant-message.component.scss'],
})
export class TenantMessageComponent implements OnInit {
  messages: ExtendedMessage[] = [];
  messageForm: FormGroup;
  currentUserId: string;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatMessageService,
    private authService: AuthService
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });

    this.currentUserId = this.authService.getCurrentUserId();
  }

  ngOnInit() {
    console.log('CurrentUserId:', this.currentUserId);
    this.loadMessages();
  }

  loadMessages() {
    this.chatService.getChatHistory().subscribe((history) => {
      this.messages = history.map((msg) => ({
        ...msg,
        isSentByCurrentUser: msg.senderId === this.currentUserId,
      }));
      this.scrollToBottom();
    });
  }

  sendMessage() {
    if (this.messageForm.invalid) return;

    const newMessage: AddMessageModel = {
      message: this.messageForm.value.message,
    };

    this.chatService.sendMessage(newMessage).subscribe((sentMessage) => {
      this.messages.push({
        ...sentMessage,
        isSentByCurrentUser: true,
      });
      this.messageForm.reset();
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const panel = document.getElementById('messagePanel');
      if (panel) panel.scrollTop = panel.scrollHeight;
    }, 100);
  }
}
