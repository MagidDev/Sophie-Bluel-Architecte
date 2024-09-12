const gallery = document.querySelector(".gallery");

let works = [];
let categories = [];

// Récupère les projets via la requête fetch
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();  // On transforme la réponse en format JSON
}

// Récupère les catégories via la requête fetch
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();  // On transforme la réponse en format JSON
    console.log("Catégories récupérées :", categories);  // Ajoute ce log
}

function createWorks(projects) {
    gallery.innerHTML = ""; // Vider la galerie avant de la remplir avec de nouveaux projets
    projects.forEach(project => {
        const projectElement = document.createElement("figure");

        const imageElement = document.createElement("img");
        imageElement.src = project.imageUrl;
        imageElement.alt = project.title;

        const captionElement = document.createElement("figcaption");
        captionElement.innerText = project.title;

        projectElement.appendChild(imageElement);
        projectElement.appendChild(captionElement);

        gallery.appendChild(projectElement);
    });
}

function createButtons(category, filterContainer) {
    const button = document.createElement("button");
    button.innerText = category.name; // Afficher le nom de la catégorie sur le bouton

    console.log("Bouton créé pour la catégorie :", category.name);

    button.addEventListener("click", () => {
        if (category.id === 0) {
            createWorks(works); // Affiche tous les projets si l'ID est 0 (cas du bouton "Tous")
        } else {
            const filteredWorks = works.filter(work => work.categoryId === category.id);
            createWorks(filteredWorks); // Affiche les projets filtrés
        }
    });

    filterContainer.appendChild(button); // Ajouter le bouton au container de filtres
}

function createFilters() {
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filters");

    console.log("Création du conteneur des filtres");

    // Créer un bouton "Tous" pour afficher tous les projets
    createButtons({name: "Tous", id: 0}, filterContainer);

    // Créer un bouton pour chaque catégorie
    categories.forEach(category => {
        createButtons(category, filterContainer);
    });

    // Ajouter le container des filtres dans le DOM
    const portfolioSection = document.querySelector("#portfolio");  // Sélectionner la section "portfolio"
    portfolioSection.insertBefore(filterContainer, gallery);  // Insérer avant la galerie dans cette section
    console.log("Conteneur des filtres ajouté au DOM");
}

async function init() {
    await getWorks();
    await getCategories();
    createWorks(works);
    createFilters();
}

init();