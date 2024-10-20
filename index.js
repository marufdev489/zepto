// Data Fetching
let books;
const itemsPerPage = 16;
let currentPage = 1;
let filteredData = [];

async function fetchData() {
  try {
    const response = await fetch(`https://gutendex.com/books`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data; // Handle the fetched data
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

(async () => {
  books = await fetchData();
  filteredData = [...books?.results]; // Store the fetched data
  renderList(); // Call render after fetching data
})();

function renderList() {
  const list = document.getElementById("list");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = filteredData.slice(start, end);

  if (paginatedData.length > 0) {
    list.innerHTML = paginatedData
      .map(
        (item) => `
          <div class="card">
            <img
              src="${item.formats["image/jpeg"]}"
              alt="Book Cover"
              class="card-img"
            />
            <div class="card-content">
              <h2 class="card-title">${item?.title}</h2>
              <p class="card-author">by <span>${item?.authors[0].name}</span></p>
              <p class="card-id">ID: <span>${item?.id}</span></p>
            </div>
          </div>`
      )
      .join("");
  } else {
    list.innerHTML = `<li>No data found</li>`;
  }

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  pagination.innerHTML = "";

  // Previous button
  pagination.innerHTML += `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="goToPage(${
    currentPage - 1
  })">Prev</button>`;

  // Page number buttons
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button class="${
        i === currentPage ? "active" : ""
      }" onclick="goToPage(${i})">${i}</button>`;
  }

  // Next button
  pagination.innerHTML += `
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="goToPage(${
    currentPage + 1
  })">Next</button>`;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderList();
  }
}

function searchData() {
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();
  filteredData = books.results.filter((item) =>
    item.title.toLowerCase().includes(searchQuery)
  );
  currentPage = 1; // Reset to first page on search
  renderList();
}

document.getElementById("search-input").addEventListener("input", searchData);
