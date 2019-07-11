import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    title = 'ischrisdrunk';
    voted = false;
    endpoint = 'https://api.cubaleon.com/frontend/is_chris_drunk';
    status = '';
    image = '';
    yes = 0;
    no = 0;

    constructor() {
        const votedTime = localStorage.getItem('voted');

        this.voted = (moment().diff(moment(votedTime)) / 1000) <= (5 * 60);
    }

    send(answer) {
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
            this.setStatus('WE DUNNO', 'chris_we_dunno.png');
        } else {
            const total = yes + no;
            const percent = (yes / total) * 100;

            if (percent > 55) {
                this.setStatus('YES', 'chris_drunk.png');
            } else if (percent < 20) {
                this.setStatus('NO', 'chris_sober.png');
            } else {
                this.setStatus('KIND OF', 'chris_kind_of.png');
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
        this.send('yes').then((response) => {
            this.voted = true;
            localStorage.setItem('voted', moment().format());
            this.setTotals(
                response.data.timeLife.isDrunk,
                response.data.timeLife.isNotDrunk
            );
        });
    }

    onClickNo() {
        this.send('no').then((response) => {
            this.voted = true;
            localStorage.setItem('voted', moment().format());
            this.setTotals(
                response.data.timeLife.isDrunk,
                response.data.timeLife.isNotDrunk
            );
        });
    }
}
