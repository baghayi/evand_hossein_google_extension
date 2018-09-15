
export class AnswerEventQuestions {

    constructor() {

        this.questions = [
            {label: "Event Id", findAnswer: (event) => event.id},
            {label: "Has Active Webinar", findAnswer: (event) => event._links.webinar == null},
            {label: "Has Connect-App", findAnswer: (event) => event.connectApp != undefined },
            {label: "Is Using Showtime", findAnswer: (event) => event.is_using_showtime && true}
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
