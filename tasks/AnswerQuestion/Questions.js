import { AnswerQuestion } from './AnswerQuestion.js';

export class Event extends AnswerQuestion {
    constructor() {
        super();
        this.questions = [
            {label: "Event Id", findAnswer: (object) => object.id, order: 1},
            {label: "Has Active Webinar", findAnswer: (object) => object._links.webinar != null, order: 2},
            //{label: "Has Connect-App", findAnswer: (object) => object.connectApp != undefined },
            {label: "Is Using Showtime", findAnswer: (object) => object.is_using_showtime && true, order: 3},
            {label: "Cancelled?", findAnswer: (object) => object.cancelled, order: 4}
        ];
    }
}

export class EventStatistics extends AnswerQuestion {

    constructor() {
        super();
        this.questions = [
            {label: "Total Attendees", findAnswer: (data) => data.attendees.all.count + " of " + data.tickets.all.count, order: 5},
            {label: "Total Guest Attendees", findAnswer: (data) => data.attendees.guest.count, order: 6}
        ];

    }
}
