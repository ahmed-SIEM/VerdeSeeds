import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Sponsor {
  datapartenariat: string;
  logo: string;
  nomSponsor: string;
}

@Component({
  selector: 'app-homeplateforme',
  templateUrl: './homeplateforme.component.html',
  styleUrls: ['./homeplateforme.component.css']
})
export class HomeplateformeComponent implements OnInit {
  isDrawerOpen = false;
  messages: { content: string | SafeHtml; isUser: boolean; isHtml: boolean }[] = [];
  newMessage = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  async handleSendMessage() {
    if (!this.newMessage.trim()) return;

    const userMessage = this.newMessage;
    this.messages.push({ content: userMessage, isUser: true, isHtml: false });
    this.newMessage = '';

    const response = await this.sendChatMessage(userMessage);
    this.messages.push({ content: response, isUser: false, isHtml: true });
  }

  private formatResponse(text: string): SafeHtml {
    // Add basic formatting for numbered lists
    text = text.replace(/(\d+\.\s+\*\*[^:]+\*\*)/g, '<h4>$1</h4>');
    // Format bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Format steps or sections
    text = text.replace(/(\d+\.\s+)/g, '<span class="step">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  async sendChatMessage(message: string): Promise<SafeHtml> {
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatResponse(data.response);
    } catch (error) {
      console.error('Error sending chat message:', error);
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="error">Error: ${error instanceof Error ? error.message : 'Unknown error'}</span>`
      );
    }
  }
}
