import { suppression } from "./edition.js";
import { initAddEventListenerGestion } from "./fenetreGestion.js";


//récupération des photos
let photos = [];
try {
    const reponse = await fetch("http://localhost:5678/api/works");
    photos = await reponse.json();
}
catch (error){
    console.log("erreur");
    const affichageErreur= document.createElement("p");
    affichageErreur.innerText="Erreur : affichage des projets impossible.";
    document.querySelector(".filtres").append(affichageErreur);
}
 
export function genererPhotos(photos, location, avecTitres){
    for (let i = 0; i < photos.length; i++){
        const fichePhoto = photos[i];
        
        //création des balises
        const figure = document.createElement("figure");
        figure.dataset.id = photos[i].id;
        const imagePhoto = document.createElement("img");
        imagePhoto.src = fichePhoto.imageUrl;
        imagePhoto.alt = fichePhoto.title;
        const trashButton = document.createElement("button");
        trashButton.classList = "trashButton"+i;
        trashButton.dataset.id = photos[i].id;
        trashButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
        const titrePhoto = document.createElement("figcaption");
        titrePhoto.innerText=fichePhoto.title;

        //rattachement des éléments
        location.appendChild(figure);
        figure.appendChild(imagePhoto);

        if (avecTitres === true){
            figure.appendChild(titrePhoto);
        } else {
            figure.append(trashButton);
        }
    }
}

const gallery = document.querySelector(".gallery");
const miniatures = document.querySelector(".miniatures");
genererPhotos(photos, gallery, true);
genererPhotos(photos, miniatures, false);



const categories=[];
for (let i=0; i < photos.length; i++){
    if (!categories.includes(photos[i].category.name)){
        categories.push(photos[i].category.name);
    }   
}

// créer les boutons filtre et les option du formulaire d'ajout
const filtres = document.querySelector(".filtres");
const filtreTous = document.createElement("button");
const select = document.querySelector("#categorie");
filtreTous.innerText = "Tous";
filtreTous.classList = "Tous";
filtres.appendChild(filtreTous);
for (let index=0; index < categories.length; index++){

    //créer les boutons filtres
    const filtre = document.createElement("button");
    filtre.innerText = categories[index];
    filtre.classList = "bouton"+index;
    filtres.appendChild(filtre);
    
    //créer les valeurs de sélection pour l'ajout de photo
    const option = document.createElement("option");
    option.value = index+1;
    option.innerText = categories[index];
    select.appendChild(option);

    //filtres sur event-listener des boutons
    const bouton= document.querySelector(".bouton"+index);
    bouton.addEventListener("click", function () {
        const photosFiltrees = photos.filter(function (photos) {
            return photos.categoryId === (index+1);
        });
        document.querySelector(".gallery").innerHTML = "";
        genererPhotos(photosFiltrees, gallery, true);
    });
}

//créer le bouton filtre Tous
const boutonTous = document.querySelector(".Tous");
boutonTous.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    genererPhotos(photos, gallery, true);
});


//si un token est enregistré, faitre apparaître les modifications (barre noire, bouton modifier et logout)
let valeurToken = window.sessionStorage.getItem("token");
if (valeurToken){
    pageEdition();
    initAddEventListenerGestion();
}

function pageEdition(){
    //barre noire
    let header = document.querySelector ("body");
    let barre = document.createElement("div");
    barre.classList = "barreEdition";
    barre.innerHTML = "<button class='bouton-filtre1'><i class='fa-regular fa-pen-to-square'></i> Mode édition</button>";
    header.prepend(barre);

    //ajout bouton Modifier
    let projets = document.querySelector("#projets");
    let modifier = document.createElement("div");
    modifier.innerHTML = "<button id='boutonModifier'><i class='fa-regular fa-pen-to-square'></i> modifier</button>";
    projets.appendChild(modifier);
    


    // changement de login en logout
    let log = document.querySelector(".boutonLog");
    log.classList="logout";
    log.innerText="logout";
}

//supprimer le token du local storage si clic sur logout
function suppressionToken(){
    const logout = document.querySelector(".logout");
    logout.addEventListener("click", function() {
        console.log("clic");
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
    }); 
}

suppressionToken();

suppression(photos);