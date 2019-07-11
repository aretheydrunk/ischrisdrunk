import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ischrisdrunk';
  voted = false;
  endpoint = 'https://api.cubaleon.com/frontend/is_chris_drunk';

    constructor() {
        const votedTime = localStorage.getItem('voted');

        this.voted = (moment().diff(moment(votedTime)) / 1000) <= (5 * 60);
    }


    send(answer) {
        this.voted = true;
        localStorage.setItem('voted', moment().format());
    return fetch(this.endpoint, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({
        isDrunk: answer
      }), // body data type must match "Content-Type" header
    }).then(response => response.json());
  }

  onClickYes() {
    this.send("yes");
  }

  onClickNo() {
    this.send("no");
  }
}
