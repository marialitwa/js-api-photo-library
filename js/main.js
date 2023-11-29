// GLOBAL VARIABLES
const apiKey = "40712154-08ce4dcac58c3112602f88d10";
const apiUrl = "https://pixabay.com/api/";
const itemsPerPage = 100;

const imgContainer = document.querySelector('[data-js="api-data"]');

const form = document.querySelector('[data-js="form-search-bar"]');
const input = document.querySelector('[data-js="input-search-bar"]');
const clearInputBtn = document.querySelector('[data-js="clear-input-btn"]');
       

// ASYNCH FETCH
async function fetchData(query) {

    // For example, searching for images of elephants. Used only when NOT filtering by searchbar query
    // const query = "elephant"; 

    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}&q=${query}&per_page=${itemsPerPage}`);
        const data = await response.json();


        if (response.ok) {
            // Success (Good Response)
            generateCards(data.hits);
            addEvents(data.hits);
            // filterMediaType(data.hits);
             
            
        } else {
            // Failure (Bad Response)
            console.error("Bad Response");
        }
    } catch (error) {
        //Failure (Network error, etc.)
        console.error("An Error occured", error);
    }
}


// FUNCTION TO CREATE IMAGE CARDS APPENDED TO DIV
function generateCards(images) {

    // console.log("Data limited to let itemsPerPage", images)

    imgContainer.innerHTML = ""; // Clear previous content

    images.forEach(function(image) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.width = "30em";
        card.style.margin = "3em";
        imgContainer.append(card);

        const img = document.createElement("img");
        img.classList.add("card-img-top");
        img.setAttribute("src", image.webformatURL);
        img.setAttribute("alt", image.tags);
        img.setAttribute("title", image.tags);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.append(img, cardBody);

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.style.fontSize = "1.5rem";
        cardTitle.style.textTransform = "capitalize";
        cardTitle.textContent = image.type
        
        const views = document.createElement("p");
        views.classList.add("card-text");
        views.textContent = `${image.views} views`;
        cardBody.append(cardTitle, views)

        const tags = document.createElement("p");
        tags.classList.add("card-text");
        tags.style.textTransform = "capitalize";
        tags.textContent = `Tags: ${image.tags}`;
        cardBody.append(tags)       
    });
}
fetchData(""); 


// FILTER BY VALUE/QUERY FROM SEARCHBAR
function filterByQuery() {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        fetchData(input.value); 
    })
}
filterByQuery();


// CLEAR SEARCHBAR INPUT AND RESET FILTER FROM SEARCHBAR QUERY
function clearInputSearchbar() {
    clearInputBtn.addEventListener('click', () => {
    input.value = "";
    fetchData(""); 
    });   
}
clearInputSearchbar();




// TARGETING SELECT + OPTIONS
// const selectType = document.querySelector('[data-js="select-type"]');
// const typePhoto = document.querySelector('[data-js="select-type-photo"]');
// const typeIllustration = document.querySelector('[data-js="select-type-illustration"]');
// const typeVector = document.querySelector('[data-js="select-type-vector"]');


// CREATE EVENT LISTENER - DOES NOT WORK YET
function addEvents(images) {

    const selectType = document.querySelector('[data-js="select-type"]');
    selectType.addEventListener("change", handleTypeChange(event, images));
    }

    function handleTypeChange(event, images) {
        const selectType = document.querySelector('[data-js="select-type"]');

        console.log("Function triggert! :)")
        // console.log(event.target.value)

        if (selectType.value === "all") {
           return generateCards(images);
        } 
            // if (selectType.value === "photo") {
            //     filterMediaType(filteredImagesByType);

    
            // } else if (selectType.value === "illustration") {
            //     filterMediaType(filteredImagesByType);

    
            // } else if (selectType.value === "vector") {
            //     filterMediaType(filteredImagesByType);

            // }

    }


    
// FILTER BY MEDIA TYPE - DOES NOT WORK YET

let filteredImagesByType = [];

function filterMediaType(images) {

    const selectType = document.querySelector('[data-js="select-type"]');
    console.log(selectType.value);

    if (selectType.value.toLowerCase() === "all")  {
        filteredImagesByType = images;
        console.log(filteredImagesByType)

    } else {

        if (selectType.value.toLowerCase() !== "all") {
            console.log(selectType.value);

            for (let i = 0; i < images.length; i++) {
                if (images[i].type.toLowerCase() === selectType.value.toLowerCase()){
                    filteredImagesByType.push(images[i]);  
                };
            }
            console.log(filteredImagesByType)

        }
    }
}