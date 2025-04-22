import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

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
  isFetching = signal(false);
  error = signal('')

  constructor(private httpClient: HttpClient, private placesService: PlacesService) { }

  ngOnInit() {
    this.isFetching.set(true);
    this.subscriptions.push(this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      },
      complete: () => {
        this.isFetching.set(false);
      },
      error: (error: Error) => {
        this.error.set(error.message);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    this.subscriptions.push(this.httpClient.put('http://localhost:3000/user-places', { placeId: selectedPlace.id }).subscribe({
      next: (response) => { console.log(response) },
      complete: () => { console.log("Completed"); },
    })
    );
  }


}
