import { AnswerQuestion } from './AnswerQuestion.js';

export class Event extends AnswerQuestion {
    constructor() {
        super();
        this.questions = [
            {label: "Event Id", findAnswer: (object) => object.id},
            {label: "Has Active Webinar", findAnswer: (object) => object._links.webinar == null},
            {label: "Has Connect-App", findAnswer: (object) => object.connectApp != undefined },
            {label: "Is Using Showtime", findAnswer: (object) => object.is_using_showtime && true}
        ];
    }
}

export class EventStatistics extends AnswerQuestion {

    constructor() {
        super();
        this.questions = [
            {label: "Total Attendees", findAnswer: (data) => data.attendees.all.count + " of " + data.tickets.all.count},
            {label: "Total Guest Attendees", findAnswer: (data) => data.attendees.guest.count}
        ];
    }
}
