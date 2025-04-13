const API_BASE_URL = '/api/items';

// Authentication check
if (!localStorage.getItem('token')) {
  window.location.href = '/auth/login.html';
}

// DOM Elements
const itemsList = document.getElementById('itemsList');
const createForm = document.getElementById('createForm');
const logoutBtn = document.getElementById('logoutBtn');

// Event Listeners
logoutBtn.addEventListener('click', logout);
createForm.addEventListener('submit', createItem);

// Load items on page load
loadItems();

// API Functions
async function makeRequest(url, options = {}) {
  try {
    options.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...options.headers
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    alert(error.message);
    throw error;
  }
}

async function loadItems() {
  try {
    const items = await makeRequest(API_BASE_URL);
    renderItems(items);
  } catch (error) {
    if (error.message.includes('401')) {
      logout();
    }
  }
}

async function createItem(e) {
  e.preventDefault();
  const formData = new FormData(createForm);
  const itemData = {
    title: formData.get('title'),
    description: formData.get('description')
  };

  try {
    await makeRequest(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
    createForm.reset();
    loadItems();
  } catch (error) {
    console.error('Create error:', error);
  }
}

window.updateItem = async (id) => {
  const item = await makeRequest(`${API_BASE_URL}/${id}`);
  const newTitle = prompt('Enter new title:', item.title);
  if (newTitle === null) return;

  const newDescription = prompt('Enter new description:', item.description || '');

  try {
    await makeRequest(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: newTitle,
        description: newDescription
      })
    });
    loadItems();
  } catch (error) {
    console.error('Update error:', error);
  }
};

window.deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  try {
    await makeRequest(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    loadItems();
  } catch (error) {
    console.error('Delete error:', error);
  }
};

function renderItems(items) {
  itemsList.innerHTML = items.map(item => `
    <div class="item">
      <h3>${item.title}</h3>
      <p>${item.description || 'No description'}</p>
      <p><small>Created: ${new Date(item.createdAt).toLocaleString()}</small></p>
      ${item.updatedAt ? `<p><small>Updated: ${new Date(item.updatedAt).toLocaleString()}</small></p>` : ''}
      <button onclick="updateItem('${item.id}')">Update</button>
      <button onclick="deleteItem('${item.id}')">Delete</button>
    </div>
  `).join('');
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/auth/login.html';
}