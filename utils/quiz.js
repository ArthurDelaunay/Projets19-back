// fonction pour générer un tableau d'id de longueur howManyIds de manière aléatoire
const generateQuestionsListRandomlyOrder = (
    questionsList,
    howManyQuestions
) => {
    //génération du tableau de questions
    const idsListStringify = JSON.stringify(questionsList)
    const questionsParsedList = JSON.parse(idsListStringify)

    // on tri aléatoirement le tableau
    for (i = questionsParsedList.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const savedValue = questionsParsedList[randomIndex]
        questionsParsedList[randomIndex] = questionsParsedList[i]
        questionsParsedList[i] = savedValue
    }
    //on coupe notre tableau pour garder le bon nombre de questions et on le renvoie
    return questionsParsedList.slice(0, howManyQuestions)
}

module.exports = { generateQuestionsListRandomlyOrder }
