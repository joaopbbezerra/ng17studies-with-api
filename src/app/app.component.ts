import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private http = inject(HttpClient)
  title = 'angular-api';

  ngOnInit() {
    this.http.get('http://localhost:3000/').subscribe(res => console.log(res))

    const guess = { guess: 14 };

    this.http.post('http://localhost:3000/', guess).subscribe((res) => {
      console.log(res);
    });
  }
}
