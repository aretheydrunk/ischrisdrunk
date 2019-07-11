import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'ischrisdrunk';
  voted = false;
  endpoint = 'https://api.cubaleon.com/frontend/is_chris_drunk';
  status = "YES";

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

  ngOnInit() {
    this.send('status').then(response => {
      this.calculateStatus(
        response['lastHour']['isDrunk'],
        response['lastHour']['isNotDrunk']
      );

      return response;
    });
  }

  calculateStatus(yes, no)
  {
    if(yes+no < 10) {
      this.setStatus('WE DUNNO');
    }else{
      let total = yes + no;
      let percent = (yes / total) * 100;

      if(percent > 55){
        this.setStatus('YES');
      }else if(percent < 35){
        this.setStatus('NO');
      }else{
        this.setStatus('MAYBE');
      }
    }
  }

  setStatus(status)
  {
    this.status = status;
  }

  onClickYes() {
    this.send('yes');
  }

  onClickNo() {
    this.send('no');
  }
}
