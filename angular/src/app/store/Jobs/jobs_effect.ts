import { Injectable } from "@angular/core";

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";

import { restApiService } from "src/app/core/services/rest-api.service";
import { addApplication, addApplicationFailure, addApplicationSuccess, deleteApplication, deleteApplicationFailure, deleteApplicationSuccess,   fetchApplicationData,   fetchApplicationFailure,   fetchApplicationSuccess,   updateApplication, updateApplicationSuccess } from "./jobs_action";


@Injectable()
export class ApplicationEffects {
    fetchApplicationList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchApplicationData),
            mergeMap(() =>
                this.restApiService.getApplicationData().pipe(
                    map((Application) => {
                        return fetchApplicationSuccess({ Application })
                    }),
                    catchError((error) =>
                        of(fetchApplicationFailure({ error }))
                    )
                )
            ),
        ),
    );

    addApplicationData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addApplication),
            mergeMap(({ newData }) =>
                this.restApiService.addApplicationData(newData).pipe(
                    map(() => addApplicationSuccess({ newData})),
                    catchError((error) => of(addApplicationFailure({ error })))
                )
            )
        )
    )

    updateApplicationData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateApplication),
            mergeMap(({ updatedData }) =>
                this.restApiService.updateApplicationData(updatedData).pipe(
                    map(() => updateApplicationSuccess({ updatedData })),
                    catchError((error) => of(addApplicationFailure({ error })))
                )
            )
        )
    );

    deleteApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteApplication),
            mergeMap(({ id }) =>
                this.restApiService.deleteApplicationData().pipe(
                    map(() => deleteApplicationSuccess({ id })),
                    catchError((error) => of(deleteApplicationFailure({ error })))
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private restApiService: restApiService
    ) { }
}