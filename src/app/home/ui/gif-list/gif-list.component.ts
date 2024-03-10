import {Component, inject, Input} from '@angular/core';
import {Gif} from "../../../shared/interfaces";
import {GifPlayerComponent} from "../gif-player/gif-player.component";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {WINDOW} from "../../../shared/utils/injection-token";

@Component({
  selector: 'app-gif-list',
  standalone: true,
  imports: [
    GifPlayerComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './gif-list.component.html',
  styleUrl: './gif-list.component.scss'
})
export class GifListComponent {
  @Input({required: true}) gifs!: Gif[]

  window = inject(WINDOW);
}
