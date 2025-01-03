import { computed, inject, Injectable, signal } from '@angular/core';
import { DatabaseReference, off, onValue } from '@angular/fire/database';
import { Chat } from 'src/app/interfaces/chat';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatMessages = signal<Chat[] | null>([]);
  currentUserId = computed(() => this.auth.uid());

  private chatsRef: DatabaseReference | null = null;
  private chatsListener: any = null;

  private api = inject(ApiService);
  private auth = inject(AuthService);

  constructor() {
  }

  init(chatroomId: string) {
    this.auth.getId();
    this.getChatMessages(chatroomId)
  }

  async sendMessage(chatroomId: string, message: string) {
    try {
      const chatsRef = this.api.getRef(`chatrooms/${chatroomId}/messages`);

      const chatData: Chat = {
        senderId: this.currentUserId()!,
        message,
        timestamp: Date.now(),
      };

      const newMessageRef = this.api.pushData(chatsRef);
      await this.api.setRefData(newMessageRef, chatData);
    } catch (e) {
      throw e;
    }
  }

  getChatMessages(chatroomId: string) {
    this.chatsRef = this.api.getRef(`chatrooms/${chatroomId}/messages`);

    this.chatsListener = onValue(this.chatsRef, (snapshot) => {
      if (snapshot?.exists()) {
        const messages = snapshot.val();

        const messagesArray: Chat[] = Object.keys(messages).map(
          (messageId) => ({
            id: messageId,
            ...messages[messageId],
            isCurrentUser:
              messages[messageId].senderId == this.currentUserId()
              ? true
              : false,
          })
        );
        this.chatMessages.set(messagesArray);
      } else {
        this.chatMessages.set([]);
      }
    }, (error) => {
      console.error(error);
    });
  }

  unsubscribeChats() {
    if(this.chatsRef) {
      off(this.chatsRef, 'value', this.chatsListener);
      this.chatsRef = null;
      this.chatsListener = null;
      this.chatMessages.set(null);
    }
  }

}
