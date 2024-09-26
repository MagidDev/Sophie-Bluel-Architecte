document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery");
    const modalAddPhoto = document.querySelector("#modal-add-photo");
    const addPhotoForm = document.querySelector('#add-photo-form');
    const inputFile = document.querySelector('#upload-image');
    const titleInput = document.querySelector('#photo-title');
    const categoryInput = document.querySelector('#photo-category');
    
    // Update: Target the "Valider" button using its unique ID
    const submitButton = document.querySelector('#submit-photo-btn'); 
    const modal = document.querySelector("#modal");

    let works = [];
    const token = sessionStorage.getItem("token");

    // Assure-toi que la modale "Ajouter une photo" est cachée par défaut
    modalAddPhoto.style.display = "none";

    // Récupère les projets via la requête fetch
    async function getWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        works = await response.json();
        return works;
    }

    // Crée les filtres de catégories et place-les sous le titre "Mes Projets"
    function createFilters() {
        const filtersContainer = document.createElement("div");
        filtersContainer.classList.add("filters");

        const categories = ["Tous", "Objets", "Appartements", "Hotels et restaurants"];
        categories.forEach((category, index) => {
            const button = document.createElement("button");
            button.classList.add("filter-button");
            button.innerText = category;
            button.dataset.category = index;

            button.addEventListener("click", function () {
                filterWorks(index);
            });

            filtersContainer.appendChild(button);
        });

        const portfolioSection = document.querySelector("#portfolio h2");
        portfolioSection.insertAdjacentElement("afterend", filtersContainer);
    }

    // Fonction pour filtrer les projets en fonction de la catégorie
    function filterWorks(categoryIndex) {
        const filteredWorks = works.filter(work => {
            if (categoryIndex === 0) {
                return true;
            } else {
                return work.categoryId === categoryIndex;
            }
        });
        createWorks(filteredWorks);
    }

    // Fonction pour supprimer un projet via l'API
    async function deleteProject(projectId) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                removeProjectFromDOM(projectId);
                console.log(`Projet avec l'ID ${projectId} supprimé`);
            } else {
                console.error("Échec de la suppression du projet");
            }
        } catch (error) {
            console.error("Erreur lors de la requête de suppression:", error);
        }
    }

    // Supprime l'élément correspondant du DOM
    function removeProjectFromDOM(projectId) {
        const projectElement = document.querySelector(`[data-id='${projectId}']`);
        if (projectElement) {
            projectElement.remove();
        }
    }

    // Crée la galerie de travaux
    function createWorks(projects) {
        gallery.innerHTML = "";
        projects.forEach(project => {
            const projectElement = document.createElement("figure");
            projectElement.setAttribute("data-id", project.id);

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

    // Crée les miniatures des projets dans la modale avec les icônes de suppression
    function createModalGallery(projects) {
        const modalGallery = document.querySelector("#gallery-thumbnails");

        if (!modalGallery) {
            console.error("Élément #gallery-thumbnails introuvable");
            return;
        }

        modalGallery.innerHTML = "";
        projects.forEach(project => {
            const thumbnailElement = document.createElement("div");
            thumbnailElement.classList.add("thumbnail");

            const imageElement = document.createElement("img");
            imageElement.src = project.imageUrl;
            imageElement.alt = project.title;

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa", "fa-trash-can", "delete-icon");

            deleteIcon.addEventListener("click", () => {
                const confirmed = confirm("Voulez-vous vraiment supprimer ce projet ?");
                if (confirmed) {
                    deleteProject(project.id);
                }
            });

            thumbnailElement.appendChild(imageElement);
            thumbnailElement.appendChild(deleteIcon);

            modalGallery.appendChild(thumbnailElement);
        });
    }

    // Gestion du chargement d'une image dans le formulaire
    inputFile.addEventListener('input', function(e) {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'image temporaire';
        img.style.width = '100px';
        img.style.height = '150px';
        const imagePreview = document.querySelector('.group-image img');
        if (imagePreview) {
            imagePreview.remove(); // Remplace l'image précédente s'il y en a une
        }
        document.querySelector('.group-image').appendChild(img);
        checkFormCompletion(); // Vérifie le formulaire à chaque upload d'image
    });

    // Soumission du formulaire "Ajouter une photo"
    addPhotoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const data = new FormData(addPhotoForm);

        try {
            const response = await fetch('http://localhost:5678/api/works/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                console.log('Photo ajoutée avec succès');
                modalAddPhoto.style.display = "none";
                works = await getWorks();
                createWorks(works); // Actualise la galerie avec la nouvelle photo
            } else {
                console.log('Erreur lors de l\'ajout de la photo', response.status);
            }
        } catch (error) {
            console.log('Erreur réseau ou serveur', error);
        }
    });

    // Fonction pour vérifier si tous les champs sont remplis avant d'activer le bouton "Valider"
    function checkFormCompletion() {
        const isTitleFilled = titleInput.value.trim() !== "";
        const isCategorySelected = categoryInput.value !== ""; 
        const isImageUploaded = inputFile.files.length > 0;

        console.log('Titre rempli:', isTitleFilled);
        console.log('Catégorie sélectionnée:', isCategorySelected);
        console.log('Image uploadée:', isImageUploaded);

        if (isTitleFilled && isCategorySelected && isImageUploaded) {
            submitButton.disabled = false;
            submitButton.classList.add("active");
            console.log("Bouton activé");
        } else {
            submitButton.disabled = true;
            submitButton.classList.remove("active");
            console.log('Bouton désactivé');
        }
    }

    // Activer ou désactiver le bouton "Valider" en fonction des champs du formulaire
    titleInput.addEventListener('input', checkFormCompletion);
    categoryInput.addEventListener('change', checkFormCompletion);
    inputFile.addEventListener('change', checkFormCompletion);

    // Afficher la vue "Ajouter une photo" lorsqu'on clique sur le bouton "Ajouter une photo"
    const addPhotoBtn = document.querySelector("#add-photo-btn");
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener("click", function () {
            modal.style.display = "none";
            modalAddPhoto.style.display = "flex";
        });
    }

    // Fermer les modales si on clique sur la croix
    const closeModalElements = document.querySelectorAll(".close");
    closeModalElements.forEach((closeBtn) => {
        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
            modalAddPhoto.style.display = "none";
        });
    });

    // Fermer la modale en cliquant à l'extérieur de celle-ci
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
        if (event.target === modalAddPhoto) {
            modalAddPhoto.style.display = "none";
        }
    });

    // Fonction pour ouvrir la modale
    function openModal(event) {
        event.preventDefault();
        createModalGallery(works); // Mettre à jour la galerie de la modale avec les projets
        modal.style.display = "flex";
    }

    // Initialisation
    async function init() {
        works = await getWorks(); // Récupère et affiche les projets dans la galerie
        createWorks(works);

        // Ajoute les filtres pour les catégories uniquement si l'utilisateur n'est pas connecté
        if (!token) {
            createFilters();
        }

        if (token) {
            const adminPanel = document.querySelector('.admin-panel');
            if (adminPanel) {
                adminPanel.style.display = 'flex';
            }

            let modifyLink = document.querySelector('.modify-link');
            if (!modifyLink) {
                modifyLink = document.createElement("a");
                modifyLink.href = "#";
                modifyLink.classList.add("modify-link");

                const icon = document.createElement("i");
                icon.classList.add("fa-regular", "fa-pen-to-square");

                const modifyText = document.createTextNode(" modifier");
                modifyLink.appendChild(icon);
                modifyLink.appendChild(modifyText);

                const portfolioTitle = document.querySelector("#portfolio h2");
                portfolioTitle.appendChild(modifyLink);

                // Ouvre la modale lorsqu'on clique sur "modifier"
                modifyLink.addEventListener("click", openModal);
            }
        }
    }

    init(); // Lancement de l'initialisation
});