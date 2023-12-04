// GLOBAL VARIABLES
const apiKey = "40712154-08ce4dcac58c3112602f88d10";
const apiUrl = "https://pixabay.com/api/";
const itemsPerPage = 50;

let currentImages = [];

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
            currentImages = data.hits;
            // console.log(data.hits)
            // console.log(data)
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
    const imgContainer = document.querySelector('[data-js="api-data"]');

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
fetchData(" "); 


// FILTER BY VALUE/QUERY FROM SEARCHBAR

// RENAME FUNCTION
function filterByQuery() {
    const selectType = document.querySelector('[data-js="select-type"]');
    const form = document.querySelector('[data-js="form-search-bar"]');
    const input = document.querySelector('[data-js="input-search-bar"]');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        fetchData(input.value); 
        selectType.value = "all";
    }) 
}
filterByQuery();


// // CLEAR SEARCHBAR INPUT AND RESET FILTER FROM SEARCHBAR QUERY
function clearInputSearchbar() {

    const input = document.querySelector('[data-js="input-search-bar"]');
    const clearInputBtn = document.querySelector('[data-js="clear-input-btn"]');

    clearInputBtn.addEventListener('click', () => {
    input.value = "";
    fetchData(""); 
    }); 
     
}
clearInputSearchbar();


// CREATE EVENT LISTENER
function addEvents() {

    const selectType = document.querySelector('[data-js="select-type"]');
    selectType.addEventListener("change", function() {
        
        if (selectType.value.toLowerCase() === "all")  {
            
            generateCards(currentImages)

        } else {

            let filteredImagesByType = [];

            // currentImages => original array with all images from API, not filtered
            // filteredImagesByType => new array with images after filter by type

            filteredImagesByType = currentImages.filter(image => {
                console.log(image.type, selectType.value)

                return image.type.toLowerCase().includes(selectType.value.toLowerCase());

            });

            generateCards(filteredImagesByType);
            console.log(filteredImagesByType)
        }
    });
}

            // ADD A MESSAGE WHEN THERE IS NO IMAGE WITH THE SELECTED VALUE/TYPE
            // DOES NOT WORK
    //         filteredImagesByType = currentImages.filter(image => {
    
    //             if (image.type.toLowerCase().includes(selectType.value.toLowerCase())) {
                    
    //                 generateCards(filteredImagesByType)
                    
    //             } else {
    //                 // alert("There is no such type");
    //                 noData()          
    //             }
    //         });
    //         generateCards(filteredImagesByType)            
    //     }
    // });
    
    // addEvents();


    function noData() {
        const noDataContainer = document.querySelector('[data-js="no-data"]');
        noDataContainer.innerHTML = "";
        const message = document.createElement("p");
        message.textContent = "This media type does not exist in our database. Please select another type.";
        message.style.color = "hotpink";
        message.style.fontSize = "2rem"
        noDataContainer.append(message);   
    }
