import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private apiUrl = 'https://api.mymemory.translated.net/get'; // Servizio gratuito

  constructor(private http: HttpClient) { }

  translate(text: string, targetLang: string) {
    const url = `${this.apiUrl}?q=${encodeURIComponent(text)}&langpair=it|${targetLang}`;
    return this.http.get<any>(url);
  }
}
