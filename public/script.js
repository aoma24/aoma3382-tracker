/*
Using the Unsplash API to display random pasta image
Partially referred to: https://youtu.be/e8p1zSNmK7Q
Original source: https://unsplash.com/developers
*/
const clientID = "FJCiQHf7dxnNHq5FIatk85sy6neYzJeEvXiX_KbXlOU";
const endpoint = `https://api.unsplash.com/photos/random/?query=pasta&orientation=landscape&client_id=${clientID}`;

const imageElement = document.querySelector("#unsplashImage");

fetch(endpoint)
  .then((response) => response.json())
  .then((jsonData) => {
    imageElement.src = jsonData.urls.regular;
  })
  .catch((error) => {
    console.log("Error: " + error);
  });


/*
Below is all related to user input and local storage
(adding, displaying, and deleting items)
*/
const form = document.getElementById('inputSection');
const itemList = document.getElementById('itemList');

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const imageFile = document.getElementById('image').files[0];
  const pastaSauce = document.querySelector('input[name="sauce"]:checked');
  let sauce = '';
  if (pastaSauce) {
    sauce = pastaSauce.value;
    console.log('Selected type of sauce:', sauce);
  } else {
    console.log('Please select a type of sauce');
  }
  const pastaType = document.getElementById('pastaType').value;
  const notes = document.getElementById('notes').value;

  // referred to: https://linuxhint.com/get-month-and-date-in-2-digit-format-in-javascript/
  const date = new Date(); 
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear(); 

  const formData = {
    id: Date.now(), // Generate a unique ID
    name: name,
    imageFile: URL.createObjectURL(imageFile),
    pastaType: pastaType,
    sauce: sauce,
    notes: notes,
    date: `${day}/${month}/${year}` // Format the date as "dd/mm/yyyy"
  };

  storeFormData(formData);
});


// Function to create and display the popup
function displayPopup(item) {
    const popupContainer = document.getElementById("popupContainer");
    const overlay = document.getElementById("overlay");
  
    // Create the popup element
    const popup = document.createElement("div");
    popup.classList.add("popup");
  
    // Create the content of the popup
    const content = document.createElement("div");
    content.classList.add("popup-content");
    content.innerHTML = `
      <button class="close-btn">Close</button>
      <h2>${item.name}</h2>
      <img class="popup-image" src="${item.imageFile}" alt="Pasta Image">
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Type of Sauce:</strong> ${item.sauce}</p>
      <p><strong>Type of Pasta:</strong> ${item.pastaType}</p>
      <p><strong>Notes:</strong></br> ${item.notes}</p>
      <button class="delete-btn2">Delete from the list</button>
    `;
  
    // Append the content to the popup
    popup.appendChild(content);
    
    // Append the popup to the popup container
    popupContainer.appendChild(popup);

    // Show the overlay and prevent scrolling on the main page
    overlay.style.display = "block";
    document.body.classList.add("popup-open");

    // Close the popup when the close button is clicked
    const closeBtn = content.querySelector(".close-btn");
    closeBtn.addEventListener("click", function () {
        popup.remove();
        overlay.style.display = "none";
        document.body.classList.remove("popup-open");
    });


    // Delete the item when the delete button is clicked
    const deleteBtn2 = content.querySelector(".delete-btn2");
    deleteBtn2.addEventListener("click", function () {
        const localItems = JSON.parse(localStorage.getItem("Pasta list"));
        const updatedItems = localItems.filter((el) => el.id !== item.id);
        localStorage.setItem("Pasta list", JSON.stringify(updatedItems));
        popup.remove();
        overlay.style.display = "none";
        document.body.classList.remove("popup-open");
        displayItems();
    });
}

// Close the popup when the overlay is clicked
overlay.addEventListener("click", function () {
    const popup = document.querySelector(".popup");
    if (popup) {
      popup.remove();
      overlay.style.display = "none";
      document.body.classList.remove("popup-open");
    }
});

// Assuming you have an array called "recipeList" containing your recipes
let recipeList = [];

// Get the count of recipes and update the element's content
function updateRecipeCount() {
  const recipeCount = recipeList.length;
  const recipeCountElement = document.getElementById("recipeCount");
  recipeCountElement.innerHTML = `You have <span> ${recipeCount}</span> recipes so far`;
}


function displayItems() {
  itemList.innerHTML = "";
  
  let localItems = JSON.parse(localStorage.getItem("Pasta list"));
  
    if (localItems !== null) {

      recipeList = localItems; //Assign localItems to recipeList

      localItems.sort((a, b) => b.id - a.id);
  
      localItems.forEach(function (item) {
        const listItem = document.createElement("li");
        listItem.setAttribute("data-id", item.id);
        listItem.innerHTML =
            `<div class="item-content">
                <p class="item-name">${item.name}</p>
                <button class="delete-btn">&times;</button>
                <img class="item-image" src="${item.imageFile}" width="50" height="75" alt="Pasta Image">
             </div>`;
  
        itemList.appendChild(listItem);

        // Add click event listener to the list item
        listItem.addEventListener("click", function () {
            displayPopup(item);
        });
  
        const deleteBtn = listItem.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function (event) {
          localItems = localItems.filter((el) => el.id !== item.id);
          localStorage.setItem("Pasta list", JSON.stringify(localItems));
  
          listItem.remove();
          event.stopPropagation();

          updateRecipeCount(); // Update the recipe count
        });
      });
    }
  updateRecipeCount(); // Update the recipe count
}


function storeFormData(formData) {
  let localItems = JSON.parse(localStorage.getItem("Pasta list"));

  if (localItems === null) {
    localItems = [formData];
  } else {
    if (localItems.find((element) => element.id === formData.id)) {
      console.log("Item ID already exists");
    } else {
      localItems.push(formData);
    }
  }

  localStorage.setItem("Pasta list", JSON.stringify(localItems));

  recipeList = localItems; // Update the recipeList array
  displayItems();
  updateRecipeCount(); // Update the recipe count

  displayItems();
}

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function () {
  form.reset();
});

// Sample dummy data for the list
const dummyItems = [
  {
    id: 1,
    name: "Spaghetti Bolognese",
    imageFile: "/assets/dummy-images/pasta1.jpg",
    pastaType: "Spaghetti",
    sauce: "tomato",
    notes: "Delicious and hearty pasta dish!",
    date: "20/05/2023"
  },
  {
    id: 2,
    name: "Spaghetti Pesto",
    imageFile: "/assets/dummy-images/pasta2.jpg",
    pastaType: "Spaghetti",
    sauce: "oil",
    notes: "Creamy and indulgent pasta dish!",
    date: "22/05/2023"
  },
  {
    id: 3,
    name: "Seafood Pasta",
    imageFile: "/assets/dummy-images/pasta3.jpg",
    pastaType: "Fettuccine",
    sauce: "oil",
    notes: "Spicy and oily pasta dish!",
    date: "25/05/2023"
  },
  {
    id: 4,
    name: "Gnocchi Arrabiata",
    imageFile: "/assets/dummy-images/pasta5.jpg",
    pastaType: "Gnocchi",
    sauce: "tomato",
    notes: "Flavorful pasta dish!",
    date: "26/05/2023"
  },
  {
    id: 5,
    name: "Penne Carbonara",
    imageFile: "/assets/dummy-images/pasta3.jpg",
    pastaType: "Penne",
    sauce: "cream",
    notes: "Creamy pasta dish with chicken!",
    date: "27/05/2023"
  }
];

function addDummyItems() {
  const storedItems = JSON.parse(localStorage.getItem("Pasta list"));
  if (storedItems === null || storedItems.length === 0) {
    localStorage.setItem("Pasta list", JSON.stringify(dummyItems));
  }
}

addDummyItems();
displayItems();
updateRecipeCount();