import {Component, computed, effect, ElementRef, Input, signal, ViewChild} from '@angular/core';
import {combineLatest, EMPTY, filter, fromEvent, map, merge, Subject, switchMap} from "rxjs";
import {toObservable} from "@angular/core/rxjs-interop";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgStyle} from "@angular/common";
import {connect} from "ngxtension/connect";

export interface GifPlayerState {
  playing: boolean;
  status: 'initial' | 'loading' | 'loaded';
}
@Component({
  selector: 'app-gif-player',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    NgStyle
  ],
  templateUrl: './gif-player.component.html',
  styleUrl: './gif-player.component.scss'
})
export class GifPlayerComponent {
  @Input({required: true}) src!: string;
  @Input({required: true}) thumbnail!: string;

  //Fake new signals API
  videoElement = signal<HTMLVideoElement | undefined>(undefined)
  @ViewChild('gifPlayer') set video(element: ElementRef<HTMLVideoElement>) {
    this.videoElement.set(element.nativeElement)
  }

  videoElement$ = toObservable(this.videoElement).pipe(
    filter((element): element is HTMLVideoElement => !!element)
  );

  state = signal<GifPlayerState>({
    playing: false,
    status: 'initial',
  })

  //Selectors
  playing = computed(() => this.state().playing);
  status = computed(() => this.state().status);

  //Sources
  togglePlay$ = new Subject<void>()

  videoLoadStart$ = combineLatest([
    this.videoElement$,
    toObservable(this.playing)
  ]).pipe(
    switchMap(([element, playing]) =>
      playing
        ? fromEvent(element, 'loadstart')
        : EMPTY
    )
  );

  videoLoadComplete$ = this.videoElement$.pipe(
    switchMap(element => fromEvent(element, 'loadeddata'))
  )

  constructor(){
    //Reducers
    const nextState$ = merge(
      this.videoLoadStart$.pipe(map(() => ({
        status: 'loading' as const,
      }))),
      this.videoLoadComplete$.pipe(map(() => ({
        status: 'loaded' as const
      }))),
    )
    connect(this.state)
      .with(nextState$)
      .with(this.togglePlay$, (state) => ({
        playing: !state.playing
      }))

    //Effects
    effect(() => {
      const video = this.videoElement();
      const playing = this.playing();
      const status = this.status();

      if (!video) { return }

      if (playing && status === 'initial') {
        video.load();
      }

      if (status === 'loaded') {
        playing ? video.play() : video.pause();
      }
    })
  }
}
