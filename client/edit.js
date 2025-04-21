async function editFieldlist (movie, title, fieldName) {
    const fieldValues = movie[fieldName]

    const fieldHtml = fieldValues.map(value =>
        `
        <div class=${fieldName}>
            <input type="text" value="${value}"/>
            <button class="delete">Delete</button>
        </div>`
    ).join("")

    document.getElementById("root").insertAdjacentHTML("beforeend", `
    <div id=${fieldName}>
        <button class="add" data-field=${fieldName}>Add new ${fieldName.slice(0, -1)}</button>
        <div class="${fieldName}-container">${fieldHtml}</div>
        <button class="save" data-field=${fieldName}>Save</button>
        </div>
    `)


    document.getElementById(fieldName).addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete")) {
            event.target.closest(`.${fieldName}`).remove();
            if (document.querySelector(".message")) {
                document.querySelector(".message").remove();
            }
        }
    
        if (event.target.classList.contains("add") && event.target.dataset.field === fieldName) {
            if (document.querySelector(".message")) {
                document.querySelector(".message").remove();
            }
    
            document.querySelector(`.${fieldName}-container`).insertAdjacentHTML("beforeend",
                `<div class="${fieldName}">
                    <input type="text" value="" required/>
                    <button class="delete">Delete</button>
                </div>`
            );
        }
    
        if (event.target.classList.contains("save") && event.target.dataset.field === fieldName) {
            const inputs = [...document.querySelectorAll(`.${fieldName} > input`)].map(input => input.value.trim());

            if (document.querySelector(".message")) {
                document.querySelector(".message").remove();
            }
    
            if (inputs.some(val => val === "")) {
                const messageHtml = `
                        <div class="message">
                            <p>Please fill out the filed(s)!</p>
                        </div>`;
                    document.getElementById(`${fieldName}`).insertAdjacentHTML("beforeend", messageHtml);
                return;
            }
    
            const response = await fetch(`/movies/${title}`, {
                method: "PATCH",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ [fieldName]: inputs })
            });
    
            if (!response.ok) {
                const messageHtml = `
                    <div class="message">
                        <p>Something went wrong. Try again!</p>    
                    </div>`;
                document.getElementById(`${fieldName}`).insertAdjacentHTML("beforeend", messageHtml);
            } else {
                if (document.querySelector(".message")) {
                    document.querySelector(".message").innerHTML = `<p>${fieldName} updated successfully!</p>`;
                } else {
                    const messageHtml = `
                        <div class="message">
                            <p>${fieldName} updated successfully!</p>
                        </div>`;
                    document.getElementById(`${fieldName}`).insertAdjacentHTML("beforeend", messageHtml);
                }
            }
        }
    });
}

async function newMovieForm() {
    
    const newMovieForm = `
        <form class="new-movie-form">
            <h3>Add New movie</h3>

            <fieldset>
                <legend></legend>
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" value="" required>
            </fieldset>
            <fieldset>
                <legend>Year</legend>
                <label for="year"></label>
                <input type="number" id="year" name="year" value="" required>
            </fieldset>
            <fieldset>
                <legend>Runtime</legend>
                <label for="runtime"></label>
                <input type="number" id="runtime" name="runtime" value="" placeholder="In minutes..."required>
            </fieldset>
            <fieldset>
                <legend>Genres</legend>
                <label for="genres"></label>
                <input type="text" id="genres" name="genres" value="" required>
            </fieldset>
            <fieldset>
                <legend>Release Date</legend>
                <label for="date"></label>
                <input type="date" id="date" name="date" value="" required>
            </fieldset>
            <fieldset>
                <legend>Director(s)</legend>
                <label for="directors"></label>
                <input type="text" id="directors" name="directors" value="" required>
            </fieldset>
            <fieldset>
                <legend>Actors</legend>
                <label for="actors"></label>
                <input type="text" id="actors" name="actors" value="" required>
            </fieldset>
            <fieldset>
                <legend>Writers</legend>
                <label for="writers"></label>
                <input type="text" id="writers" name="writers" value="" required>
            </fieldset>
            <fieldset>
                <legend>Storyline:</legend>
                <label for="story"></label>
                <textarea  id="story" name="story" rows="4" cols="40" value="" required></textarea>
            </fieldset>
            <button class="save-new-movie" type="submit">Save</button>
            <button class="cancel-new-movie-form" type="button">Cancel</button>        
        </form`;

        document.getElementById("root"). insertAdjacentHTML("beforeend", newMovieForm)

        document.querySelector(".cancel-new-movie-form").addEventListener("click", () => {
            document.querySelector(".new-movie-form").remove();
        
        });
}
async function handleNewMovie(callback) {

    document.querySelector(".create-new-movie").addEventListener("click", callback)

  
}


async function main() {
    const newMovieButton = `
            <button class="create-new-movie" type="button">Create new movie to the database</button>
        `;
    const backPageButton = `
        <button class="back-btn" type="button">
            Back to the main page
        </button>`;


    document.getElementById("root").insertAdjacentHTML("afterbegin", `<nav>${backPageButton} ${newMovieButton}</nav>`);
    document.querySelector(".back-btn").addEventListener("click", ()=> {
        window.location.href = `index.html`
    });

    const title = window.location.search.split("?title=")[1];

    const response = await fetch(`/movies/${title}`)
    const movie = await response.json();
    console.log(movie)

    await editFieldlist(movie, title, "actors");
    await editFieldlist(movie, title, "writers");
    await editFieldlist(movie, title, "directors")
    await handleNewMovie(newMovieForm)




    

    



}




main();