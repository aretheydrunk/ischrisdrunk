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
  image = "chris_drunk.png";
  yes = 0;
  no = 0;

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
      console.log(response);

      this.calculateStatus(
        response['lastHour']['isDrunk'],
        response['lastHour']['isNotDrunk']
      );

      this.setTotals(
        response['timeLife']['isDrunk'],
        response['timeLife']['isNotDrunk']
      );

      return response;
    });
  }

  calculateStatus(yes, no)
  {
    if(yes+no < 10) {
      this.setStatus('WE DUNNO', 'chris_drunk.png');
    }else{
      let total = yes + no;
      let percent = (yes / total) * 100;

      if(percent > 55){
        this.setStatus('YES', 'chris_drunk.png');
      }else if(percent < 35){
        this.setStatus('NO', 'chris_sober.png');
      }else{
        this.setStatus('MAYBE', 'chris_kind_of.png');
      }
    }
  }

  setStatus(status, image) {
    this.status = status;
    this.image = image;
  }

  setTotals(yes, no) {
    this.yes = yes;
    this.no = no;
  }

  onClickYes() {
    this.send('yes');
  }

  onClickNo() {
    this.send('no');
  }
}
