import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit, OnDestroy {
  places = signal<Place[] | undefined>(undefined);
  subscriptions: Subscription[] = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.subscriptions.push(this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map((response) => response.places),
      )
      .subscribe({
        next: (places) => {
          this.places.set(places);
        }
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }


}
