import { Injectable } from "@angular/core";

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";

import { restApiService } from "src/app/core/services/rest-api.service";
import { fetchProjectListData, fetchProjectListFailure, fetchProjectListSuccess } from "./project_action";


@Injectable()
export class ProjectEffects {

    // Project
    fetchProjectData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchProjectListData),
            mergeMap(() =>
                this.restApiService.getProjectData().pipe(
                    map((Project) => {
                        // const Project = JSON.parse(Project).data;
                        return fetchProjectListSuccess({ Project })
                    }),
                    catchError((error) =>
                        of(fetchProjectListFailure({ error }))
                    )
                )
            ),
        ),
    );

    // deleteProjectData$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(deleteProject),
    //         mergeMap(({ id }) =>
    //             this.restApiService.deleteData(id).pipe(
    //                 map(() => deleteProjectSuccess({ id })),
    //                 catchError((error) => of(deleteProjectFailure({ error })))
    //             )
    //         )
    //     )
    // );


    constructor(
        private actions$: Actions,
        private restApiService: restApiService
    ) { }
}