const breedSelect = document.getElementById('breed-select');
const dogImage = document.getElementById('dog-image');
const description = document.getElementById('description');
const searchInput = document.getElementById('filter-input');
const searchButton = document.getElementById('filter-button');
const likeButton = document.getElementById('like-button');
const detailsButton = document.getElementById('details-button');
const bredFor = document.getElementById('bred-for');
const lifeSpan = document.getElementById('life-span');
const dogApi = 'https://api.thedogapi.com/v1/breeds'
const likedBreedsList = document.getElementById('liked-breeds-list');
const temper = document.getElementById('temper');
let likedBreeds = []

// Function to fetch dog breeds from the API
function fetchBreeds() {
    fetch(dogApi)
    .then(response => response.json())
    .then(data => {
        // Populate Dropdown menu with dog breeds
        data.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    })
}

// Function to fetch a random image of a given breed from the API
function fetchRandomImage(breedId) {
    fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}&limit=1`)
    .then(response => response.json())
    .then(data => {
        // Display the image of the selected breed
        if (data.length > 0) {
            dogImage.src = data[0].url;
        }
    })
}

// Function to fetch breed description from Wikipedia API
function fetchBreedDescription(breedName) {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${breedName}`;
    fetch(wikiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.extract) {
          // Display Wikipedia description
          description.textContent = data.extract;
        } else {
          description.textContent = 'Whoops! Don\'t really know much about this little guy.';
        }
      })
}

// Event listener for breed selection
breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;
    if (selectedBreedId) {
        fetchBreedDescription(breedSelect.options[breedSelect.selectedIndex].text);
        fetchRandomImage(selectedBreedId);
        hideDogFacts();
        
        // Check if the breed is not liked and set the like button's color accordingly
        if (!likedBreeds.includes(breedSelect.options[breedSelect.selectedIndex].text)) {
            likeButton.classList.remove('liked'); 
            likeButton.classList.remove('fas');
            likeButton.classList.add('far');
        } else {
            // If the breed is liked, set the like button's color to liked state
            likeButton.classList.add('liked');
            likeButton.classList.remove('far');
            likeButton.classList.add('fas'); 
        }
    } else {
        // Clear image and description if no breed is selected
        dogImage.src = '';
        description.textContent = '';

        // Change like button's color back to unliked state
        likeButton.classList.remove('liked');
        likeButton.classList.remove('fas'); 
        likeButton.classList.add('far'); 
    }
});

// Event listener for search button
searchButton.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim();
    if (searchQuery !== '') {
        // Clear previous options
        breedSelect.innerHTML = '<option value="">Choose a Breed</option>';
        fetch(dogApi)
        .then(response => response.json())
        .then(data => {
            // Filter breeds based on search query
            const filteredBreeds = data.filter(breed => breed.name.toLowerCase().includes(searchQuery.toLowerCase()));
            // Populate Dropdown menu with filtered dog breeds
            filteredBreeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed.id;
                option.textContent = breed.name;
                breedSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching dog breeds:', error));
    } else {
        // If search query is empty, fetch all breeds
        fetchBreeds();
    }
});

// Function to fetch breed details from the API
function fetchBreedDetails(breedId) {
    const apiUrl = `https://api.thedogapi.com/v1/breeds/${breedId}`;
    fetch(apiUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // Extract relevant details
            const { bred_for, life_span, temperament } = data;
            // Display the fetched details
            bredFor.textContent = `Bred for: ${bred_for}`;
            lifeSpan.textContent = `Life span: ${life_span}`;
            temper.textContent = `Temperament: ${temperament}`;
            // Show the details section
            document.getElementById('details-section').style.display = 'block';
        })
}

// Function to hide the dog facts for the new breed selected
function hideDogFacts() {
    bredFor.textContent = '';
    lifeSpan.textContent = '';
    temper.textContent = '';
    document.getElementById('details-section').style.display = 'none';
}

// Event listener for details button click that also hides dog facts if no breed is selected
detailsButton.addEventListener('click', () => {
    const selectedBreedId = breedSelect.value;
    if (selectedBreedId) {
        fetchBreedDetails(selectedBreedId);
    } else {
        hideDogFacts();
    }
});

// Event listener for like button click
likeButton.addEventListener('click', () => {
    const selectedBreedName = breedSelect.options[breedSelect.selectedIndex].text;
    // Check if the selected breed is not the default "Choose a Breed" option
    if (selectedBreedName !== "Choose a Breed") {
        if (!likedBreeds.includes(selectedBreedName)) {
            // Add breed to liked breeds list
            likedBreeds.push(selectedBreedName);
            likeButton.classList.add('liked'); 
            likeButton.classList.remove('far'); 
            likeButton.classList.add('fas'); 
        } else {
            likedBreeds = likedBreeds.filter(breed => breed !== selectedBreedName);
            likeButton.classList.remove('liked'); 
            likeButton.classList.remove('fas'); 
            likeButton.classList.add('far'); 
        }

        // Update liked breeds list in the UI
        updateLikedBreedsList();
    }
});

// Function to update the liked breeds list in the UI
function updateLikedBreedsList() {
    likedBreedsList.innerHTML = '';
    likedBreeds.forEach(breed => {
        const listItem = document.createElement('li');
        listItem.textContent = breed;
        likedBreedsList.appendChild(listItem);
    });
}

fetchBreeds();
