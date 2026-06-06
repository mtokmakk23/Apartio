import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface Event {
    type: string;
    payload?: any;
}

type EventCallback = (payload: any) => void;

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private handler = new Subject<Event>();
    constructor() { }

    /**
     * Broadcast the event
     * @param type type of event
     * @param payload payload
     */
    broadcast(type: string, payload = {}) {
        this.handler.next({ type, payload });
    }
    changePrimengMode=(mode:string)=>{
        // if (mode == 'dark') {
        //   (document.getElementById('primeng-theme') as HTMLLinkElement).href =
        //     'assets/scss/theme/lara-dark-blue/theme.css';
        // } else {
        //   (document.getElementById('primeng-theme') as HTMLLinkElement).href =
        //     'assets/scss/theme/lara-light-blue/theme.css';
        // }
      }
    /**
     * Subscribe to event
     * @param type type of event
     * @param callback call back function
     */
    subscribe(type: string, callback: EventCallback): Subscription {
        return this.handler.pipe(
            filter(event => event.type === type)).pipe(
                map(event => event.payload))
            .subscribe(callback);
    }
}
