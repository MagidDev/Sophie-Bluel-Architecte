async function getWorks() {
    try {
        // Appel à l'API pour récupérer les projets
        const response = await fetch("http://localhost:5678/api/works");
        const projects = await response.json();  // On transforme la réponse en format JSON

        console.log(projects);  // Affiche tous les projets dans la console

        const gallery = document.querySelector(".gallery");

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
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
    }
}

getWorks();
