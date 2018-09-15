
export class AnswerEventStatisticQuestions {

    constructor() {

        this.questions = [
            {label: "Total Attendees", findAnswer: (data) => data.attendees.all.count + " of " + data.tickets.all.count},
            {label: "Total Guest Attendees", findAnswer: (data) => data.attendees.guest.count}
        ];
    }

    answer(event) {
        let answeredQuestions = document.createElement("div");

        this.questions.map(function(question){
            let answerEement = document.createElement('span');

            let answer = question.findAnswer(event);
            switch(typeof(answer)){
                case "boolean":
                    answerEement.innerHTML = answer ? "Sure" : "Na";
                    break;

                default:
                    answerEement.innerHTML = answer;
            }

            let questionAnswer = document.createElement("p");
            questionAnswer.innerHTML = question.label + ": " + answerEement.outerHTML;

            answeredQuestions.innerHTML += questionAnswer.outerHTML;
        });

        return answeredQuestions.outerHTML;
    }

}
