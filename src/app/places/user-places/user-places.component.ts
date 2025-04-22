import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isFetching = signal(false);
  error = signal('');
  userPlaces = signal<Place[] | undefined>(undefined);

  constructor(private httpClient: HttpClient, private placesService: PlacesService) {
  }

  ngOnInit() {
    this.isFetching.set(true);
    this.subscriptions.push(this.placesService.loadUserPlaces().subscribe({
      next: (places) => {
        this.userPlaces.set(places);
      },
      complete: () => {
        this.isFetching.set(false);
      },
      error: (error: Error) => {
        this.error.set(error.message);
      }

    })

    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscribtion) => {
      subscribtion.unsubscribe();
    })
  }

  onDeleteUserPlace(selectedUserPlace: Place) {
    this.subscriptions.push(
      this.placesService.removeUserPlace(selectedUserPlace).subscribe({
        next: (response) => {
          console.log(response);
        },
        complete: () => {
          this.userPlaces.set(this.userPlaces()?.filter((userPlace) => userPlace.id !== selectedUserPlace.id));
          console.log("Completed");
        }
      })
    );
  }




}
