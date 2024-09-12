const gallery = document.querySelector(".gallery");

let works = []
let categories = []

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();  // On transforme la réponse en format JSON

    works = data;
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();  // On transforme la réponse en format JSON

    categories = data;
}


function createWorks(projects) {
       
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

// createButtons(obj) {
//     addeventluister(, () => {
//         console.log(obj.id)
//     })
// }

// createFilters() {
//     createButton({name: "Tous", id: 0})
//     categories.forEach(category => {
//         createButton(category)
//     })

// }

async function init() {
    await getWorks();
    await getCategories();
    console.log(categories)
    createWorks(works);
}

init()

