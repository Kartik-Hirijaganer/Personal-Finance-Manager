import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  public year: number = new Date().getFullYear();
  public sourceCode: string = 'https://github.com/Kartik-Hirijaganer/Personal-Finance-Manager';
  public gitHub: string = 'https://github.com/Kartik-Hirijaganer';
  public email: string = 'https://mail.google.com/mail/u/1/?view=cm&fs=1&to=kartikhirijaganer@gmail.com&tf=1';
  public linkedIn: string = 'https://www.linkedin.com/in/kartik-hirijaganer/';
}