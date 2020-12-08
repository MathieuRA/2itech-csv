const csv = require('fast-csv')
const fs = require('fs')

// Quel delais pour afficher chaque post ?
const delay = 2e3 // 2e3 === 2000 === 2 seconde
// Tableau qui contiendra les posts
const posts = []
// Tableau de verification pour eviter les doublons
const randomeNumber = []

// Itérateur pour stoper l'affichage de nos posts
let i = 0
// L'id du futur setInterval sera stocker ici. On aura besoin de l'id pour pouvoir le stop
let intervalId = null

// Génere un nombre aléatoire entre 1 et le nombre passer en parametre
const getRandomNumber = max => Math.floor(Math.random() * Math.floor(max))

// Tant que i est inférieure au nombre d'entrer dans le tableau posts, alors on apelle getPost, sinon, alors tout le tableau est parcourue on stop l'interval
const showPost = entries => i < entries ? getPost(entries) : (clearInterval(intervalId), console.log('Tout les posts on été traiter'))

// Génere un apelle de la fonction showPost tout les XXX secondes ( suivant le delais choisis plus haut )
const interval = entries => intervalId = setInterval(() => {
    showPost(entries)
    i++
}, delay);

// Nous recupere le poste ( et l'affiche dans la console ici)
const getPost = entries => {
    // Vérification si le poste choisis à déjà été traiter.
    // Tant que le poste à déjà été traité alors on tire un autre poste.
    let number = getRandomNumber(entries)
    while (randomeNumber.includes(number)) {
        number = getRandomNumber(entries)
    }
    randomeNumber.push(number)
    // Affichage et retours du poste
    console.log(posts[number])
    return posts[number]
}

fs.createReadStream('MOCK_DATA.csv')
    .pipe(csv.parse({
        headers: true
    }))
    .on('error', error => console.log(error))
    .on('data', data => posts.push(data))
    .on('end', rowData => interval(rowData))