async function handleDeleteMovie() {
    
    document.querySelector(".delete-movie-btn").addEventListener("click", async (event) => {

        if (document.querySelector(".delete-message")) {
            document.querySelector(".delete-message").remove();
        }
        
        const title = event.target.dataset.title
        console.log(title)

        try {
            const response = await fetch(`/movies/${title}`, {
                method : "DELETE"
            });
            if (!response.ok) {
                console.log("Something went wrong!")
            }

            document.getElementById("root").insertAdjacentHTML("afterbegin", `<p class="delete-message">The movie <strong>${title}</strong> was successfully deleted!</p>`);
            
        } catch (error) {
            console.log(error)
        }
        
            

    })
}

async function main() {
    const res = await fetch("/movies")
    const movies = await res.json();

    const moviesHtml = movies.map(movie => 
        `
        <tr>
            <td>${movie.title}</td>
            <td><button class="edit" data-title="${movie.title}">Edit</button></td>
            <td><button class="delete-movie-btn" data-title="${movie.title}">Delete</button></td>
        </tr>
        `
    ).join("");
    document.getElementById("root").innerHTML = `<table>${moviesHtml}</table>`;

    document.querySelectorAll(".edit").forEach(editBtn => {
        editBtn.addEventListener("click", (event) => {
            window.location.href = `edit.html?title=${encodeURIComponent(event.target.dataset.title)}`
        })
    });

    await handleDeleteMovie();


}
















main();