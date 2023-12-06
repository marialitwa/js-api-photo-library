// GLOBAL VARIABLES
const apiUrl = "https://pixabay.com/api/";
const itemsPerPage = 3;

let currentImages = [];
// currentImages => "original" array with all images from API, not filtered
// filteredImagesByType => new array with images after filter by type


// ASYNCH FETCH
async function fetchData(query) {

    // For example, searching for images of elephants. Used only when NOT filtering by searchbar query
    // const query = "elephant"; 

    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}&q=${query}&per_page=${itemsPerPage}`);
        const data = await response.json();

        console.log(data)
    
        if (response.ok) {
            // Success (Good Response)
            generateCards(data.hits);
            addEvents(data.hits);
            currentImages = data.hits;
            // filterbyCategory(data.hits)
            console.log(data.hits)
             
        } else {
            // Failure (Bad Response)
            console.error("Bad Response");
        }
    } catch (error) {
        //Failure (Network error, etc.)
        console.error("An Error occured", error);
    }
}


// FUNCTION TO CREATE IMAGE CARDS APPENDED TO API DATA DIV in index.html
function generateCards(images) {

    const imgContainer = document.querySelector('[data-js="api-data"]');

    imgContainer.innerHTML = ""; // Clear previous content

    images.forEach(function(image) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("rounded");
        card.style.boxShadow = "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px";
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

        const cardTitle = document.createElement("h3");
        cardTitle.classList.add("card-title");
        cardTitle.style.fontSize = "2rem";
        cardTitle.style.textTransform = "capitalize";
        cardTitle.style.marginBottom = "1em";
        cardTitle.textContent = image.type

        const tags = document.createElement("p");
        tags.classList.add("card-text");
        tags.style.textTransform = "capitalize";
        tags.style.lineHeight = "1.2rem";
        tags.textContent = `${image.tags}`;
       
        const views = document.createElement("p");
        views.classList.add("card-text");
        views.style.lineHeight = "1.2rem";
        views.textContent = `${image.views} views `;

        const likes = document.createElement("p");
        likes.classList.add("card-text");
        likes.style.lineHeight = "1.2rem";
        likes.textContent = `❤ ${image.likes} likes`;
        
        const links = document.createElement("a");
        links.classList.add("btn");
        links.classList.add("btn-dark");
        links.classList.add("rounded");
        links.style.padding = ".5em 1.7em";
        links.style.marginTop = "2.5em";
        links.setAttribute('href', `${image.pageURL}`)
        links.setAttribute('target', '_blank');
        links.textContent =  "More Information"

        cardBody.append(cardTitle, tags, views, likes, links)
    });
}
fetchData(" "); 


// FILTER BY VALUE/QUERY FROM SEARCHBAR
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


// CLEAR SEARCHBAR INPUT AND RESET FILTER FROM SEARCHBAR INPUT/QUERY
function clearInputSearchbar() {

    const input = document.querySelector('[data-js="input-search-bar"]');
    const clearInputBtn = document.querySelector('[data-js="clear-input-btn"]');

    clearInputBtn.addEventListener('click', () => {
    input.value = "";
    fetchData(""); 
    }); 
     
}
clearInputSearchbar();




// CREATE EVENT LISTENER TO FILTER BY MEDIA TYPE. DISPLAYS MESSAGE WHEN THERE IS NO DATA EXISTING FOR SELECTED MEDIA TYPE
function addEvents() {

    let filteredImagesByType = [];
    const selectType = document.querySelector('[data-js="select-type"]');

    selectType.addEventListener("change", function() {
        
        if (selectType.value.toLowerCase() === "all") {
            
            generateCards(currentImages);

            console.log("Current Images",currentImages)

        } else if (selectType.value) {

            filteredImagesByType = currentImages.filter(image => {
                return image.type.toLowerCase().includes(selectType.value.toLowerCase());
            });


            // DISPLAY MESSAGE WHEN THERE IS NO DATA WITH THE SELECTED VALUE/TYPE
            if (filteredImagesByType.length === 0) {
                generateCards(filteredImagesByType);
                noData();

            } else {
                generateCards(filteredImagesByType);
            }

        } else {

            // DISPLAY MESSAGE WHEN THERE IS NO DATA WITH THE SELECTED VALUE/TYPE
            noData();


        }
    });
}


// FUNCTION TO APPEND MESSAGE WHEN THERE DOES NOT EXIST DATA WITH SELECTED VALUE 
function noData() {
    const noDataContainer = document.querySelector('[data-js="no-data"]');
    noDataContainer.innerHTML = "";

    const message = document.createElement("p");
    message.classList.add("text-dark");
    message.textContent = "We're truley sorry! We don't have any media type of this kind. Please select another option.";
    message.style.fontSize = "1.8rem";
    message.style.textAlign = "center";
    message.style.boxShadow = "2px 2px 2px black;";
    message.style.margin = "2em 5em";

    noDataContainer.append(message); 
};





// CREATE EVENT LISTENER TO FILTER BY MEDIA TYPE WITHOUT DISPLAYING A MESSAGE WHEN THERE IS NOT DATA OF THIS TYPE.
// function addEvents() {

//     const selectType = document.querySelector('[data-js="select-type"]');
//     selectType.addEventListener("change", function() {
        
//         if (selectType.value.toLowerCase() === "all")  {
            
//             generateCards(currentImages)

//         } else {

//             let filteredImagesByType = [];

//             filteredImagesByType = currentImages.filter(image => {
//                 //console.log(image.type, selectType.value)

//                 return image.type.toLowerCase().includes(selectType.value.toLowerCase());
//             });

//             generateCards(filteredImagesByType);
//             //console.log(filteredImagesByType)
        
//         }
//     });
// }


// FUNCTION TO FILTER BY CATEGORY. DOES NOT WORK FOR NOW BECAUSE CANNOT ACCESS THE KEY "CATEGORY" FROM API. 
// function filterbyCategory() {

//     const selectCategory = document.querySelector('[data-js="select-category"]');
//     selectCategory.addEventListener("change", function() {

//         if (selectCategory.value === "all")  {

//             generateCards(currentImages)
//             console.log("current Images: ", currentImages)

//         } else {
            
//             const filteredImagesByCategory = currentImages.filter(image => {
//                 console.log("image category:", image.category, "select value:", selectCategory.value)

//                 return image.category === selectCategory.value;
//             });

//             generateCards(filteredImagesByCategory);
//             console.log("filtered Images By Category:", filteredImagesByCategory)
//         }
//     });
// }