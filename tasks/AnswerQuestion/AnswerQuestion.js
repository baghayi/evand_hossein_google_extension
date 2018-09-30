let answers = [];

export class AnswerQuestion {

    answer(object) {
        this.questions.map(function(question){
            let answerEement = document.createElement('span');

            let answer = 'undefined';
            try {
                answer = question.findAnswer(object);
            }catch(error) {
                console.log(error);
            }

            switch(typeof(answer)){
                case "boolean":
                    answerEement.innerHTML = answer ? "Sure" : "Na";
                    break;

                default:
                    answerEement.innerHTML = answer;
            }

            let questionAnswer = document.createElement("p");
            questionAnswer.innerHTML = question.label + ": " + answerEement.outerHTML;

            answers.push({
                order: question.order,
                answer: questionAnswer.outerHTML
            });
        });

        this.sortAnswers();
        this.displayAnswers();
    }

    sortAnswers() {
        answers = answers.sort(function(a, b){
            return a.order - b.order;
        });
    }

    displayAnswers(){
        let questionAnswers = document.getElementById('question-answers');
        questionAnswers.innerHTML = answers.reduce(function(a, b){
            return a + b.answer;
        }, '');
    }
}
