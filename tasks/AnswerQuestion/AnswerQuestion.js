export class AnswerQuestion {

    answer(object) {
        let answeredQuestions = document.createElement("div");

        this.questions.map(function(question){
            let answerEement = document.createElement('span');

            let answer = question.findAnswer(object);
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

        return answeredQuestions.innerHTML;
    }
}