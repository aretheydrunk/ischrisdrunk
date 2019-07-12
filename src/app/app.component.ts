import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    voted = false;
    endpoint = 'https://api.cubaleon.com/frontend/is_chris_drunk';
    status = '';
    image = '';
    yes = 0;
    no = 0;
    isLoading = true;
    isSending = false;

    mockData = {
      data: {
        lastHour: {
          isDrunk: 0,
          isNotDrunk: 0,
        },
        timeLife: {
          isDrunk: 0,
          isNotDrunk: 0,
        },
      }
    };

    constructor() {
        const votedTime = localStorage.getItem('voted');

        this.voted = (moment().diff(moment(votedTime)) / 1000) <= (5 * 60);
    }

    async mockUpdate(answer)
    {
      switch(answer){
        case 'status':
          return this.mockData;

        case 'yes':
          this.mockData.data.lastHour.isDrunk++;
          this.mockData.data.timeLife.isDrunk++;
          return this.mockData;

        case 'no':
          this.mockData.data.lastHour.isNotDrunk++;
          this.mockData.data.timeLife.isNotDrunk++;
          return this.mockData;
      }
    }

    async send(answer) {
        if(window.location.href.match('localhost')){
          return await this.mockUpdate(answer);
        }

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
            console.log(response.data);

            this.isLoading = false;
            this.calculateStatus(
                response.data.lastHour.isDrunk,
                response.data.lastHour.isNotDrunk
            );

            this.setTotals(
                response.data.timeLife.isDrunk,
                response.data.timeLife.isNotDrunk
            );

            return response;
        });
    }

    calculateStatus(yes, no) {
        if (yes + no < 5) {
            this.setStatus('MAYBE', 'chris_we_dunno-min.png');
        } else {
            const total = yes + no;
            const percent = (yes / total) * 100;

            if (percent > 55) {
                this.setStatus('YES!', 'chris_drunk-min.png');
            } else if (percent < 20) {
                this.setStatus('NO', 'chris_sober-min.png');
            } else {
                this.setStatus('KIND OF...', 'chris_kind_of-min.png');
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

    onVote(answer) {
        this.isSending = true;

        this.send(answer).then((response) => {
            this.voted = true;
            this.isSending = false;
            localStorage.setItem('voted', moment().format());

            this.setTotals(
                response.data.timeLife.isDrunk,
                response.data.timeLife.isNotDrunk
            );
        });
    }
}
