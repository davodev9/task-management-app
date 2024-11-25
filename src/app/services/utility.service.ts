import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  generateRandomString(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    return `${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
  }
}
