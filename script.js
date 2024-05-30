document.addEventListener("DOMContentLoaded", function() {
    // Код, який залежить від DOM, повинен бути тут
    document.getElementById("filter-button").addEventListener("click", filterCustomers);
    document.getElementById("clear-button").addEventListener("click", clearFilter);
    document.getElementById("add-customer-form").addEventListener("submit", addCustomer);
});

const customersKey = "customers";

// Функція для збереження клієнтів в локальному сховищі
function saveCustomersToLocalStorage(customersArray) {
    localStorage.setItem(customersKey, JSON.stringify(customersArray));
}

// Функція для завантаження клієнтів з локального сховища
function loadCustomersFromLocalStorage() {
    const customersString = localStorage.getItem(customersKey);
    return customersString ? JSON.parse(customersString) : [];
}

// Функція для відображення клієнтів на сторінці
function displayCustomers(customersArray) {
    const customerCardsContainer = document.getElementById("customer-cards");

    // Очищаємо контейнер перед відображенням нових клієнтів
    customerCardsContainer.innerHTML = "";

    // Створюємо та додаємо картку для кожного клієнта в контейнер
    customersArray.forEach((customer, index) => {
        const customerCard = document.createElement("div");
        customerCard.classList.add("customer-card");
        customerCard.innerHTML = `
            <h3>${customer.name}</h3>
            <p><strong>Company:</strong> ${customer.company}</p>
            <p><strong>Sum:</strong> ${customer.sum}</p>
            <p><strong>Product:</strong> ${customer.product}</p>
            <button class="edit-button">Edit</button>
            <button class="delete-button" data-index="${index}">Delete</button>
        `;
        customerCardsContainer.appendChild(customerCard);
    });

    // Додаємо обробники подій для кожної кнопки "Edit"
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', handleEditButtonClick);
    });

    // Додаємо обробники подій для кожної кнопки "Delete"
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteButtonClick);
    });
}

// Функція для додавання клієнта
function addCustomer(event) {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки після відправки форми

    // Отримуємо значення полів форми
    const name = document.getElementById("customer-name").value;
    const company = document.getElementById("customer-company").value;
    const sum = document.getElementById("customer-sum").value;
    const product = document.getElementById("customer-product").value;

    // Створюємо об'єкт нового клієнта
    const newCustomer = {
        name,
        company,
        sum,
        product,
    };

    // Додаємо нового клієнта в масив
    customers.push(newCustomer);

    // Зберігаємо клієнтів в локальному сховищі
    saveCustomersToLocalStorage(customers);

    // Відображаємо оновлений список клієнтів
    displayCustomers(customers);

    // Очищаємо поля форми
    event.target.reset();
}

// Функція для видалення клієнта
function handleDeleteButtonClick(event) {
    const indexToDelete = event.target.dataset.index;
    customers.splice(indexToDelete, 1); // Видаляємо клієнта з масиву
    saveCustomersToLocalStorage(customers); // Зберігаємо зміни в локальному сховищі
    displayCustomers(customers); // Оновлюємо відображення списку клієнтів
}

// Функція для відображення форми редагування
function handleEditButtonClick(event) {
    const card = event.target.closest('.customer-card');
    const nameElement = card.querySelector('h3');
    const companyElement = card.querySelector('p:nth-of-type(1)');
    const sumElement = card.querySelector('p:nth-of-type(2)');
    const productElement = card.querySelector('p:nth-of-type(3)');

    // Отримуємо поточні значення
    const name = nameElement.textContent.trim();
    const company = companyElement.textContent.replace('Company: ', '').trim();
    const sum = sumElement.textContent.replace('Sum: $', '').trim();
    const product = productElement.textContent.replace('Product: ', '').trim();

    // Показуємо форму редагування з поточними значеннями
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <label for="edit-customer-name">Name:</label>
        <input type="text" id="edit-customer-name" value="${name}" required>
        <label for="edit-customer-company">Company:</label>
        <input type="text" id="edit-customer-company" value="${company}" required>
        <label for="edit-customer-sum">Sum:</label>
        <input type="number" id="edit-customer-sum" value="${sum}" required>
        <label for="edit-customer-product">Product:</label>
        <input type="text" id="edit-customer-product" value="${product}" required>
        <button type="submit" class="save-button">Save</button>
    `;

    // Замінюємо картку на форму редагування
    card.innerHTML = '';
    card.appendChild(editForm);

    // Додаємо обробник події для кнопки "Save"
    editForm.addEventListener('submit', handleSaveButtonClick);
}

// Функція для збереження змінених даних після редагування
function handleSaveButtonClick(event) {
    event.preventDefault();

    const card = event.target.closest('.customer-card');
    const name = document.getElementById('edit-customer-name').value;
    const company = document.getElementById('edit-customer-company').value;
    const sum = document.getElementById('edit-customer-sum').value;
    const product = document.getElementById('edit-customer-product').value;

    // Оновлюємо вміст картки з новими значеннями
    card.innerHTML = `
        <h3>${name}</h3>
        <p>Company: ${company}</p>
        <p>Sum: $${sum}</p>
        <p>Product: ${product}</p>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
    `;

    // Додаємо знову обробники подій для кнопок "Edit" і "Delete"
    const editButton = card.querySelector('.edit-button');
    editButton.addEventListener('click', handleEditButtonClick);
    
    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', handleDeleteButtonClick);
}

// Функція для фільтрації клієнтів
function filterCustomers() {
    const nameFilter = document.getElementById("customer-name").value.toLowerCase();
    const companyFilter = document.getElementById("customer-company").value.toLowerCase();
    const sumFilter = document.getElementById("customer-sum").value.toLowerCase();
    const productFilter = document.getElementById("customer-product").value.toLowerCase();

    // Застосовуємо фільтри до списку клієнтів
    const filteredCustomers = customers.filter(customer => {
        const nameMatch = customer.name.toLowerCase().includes(nameFilter);
        const companyMatch = customer.company.toLowerCase().includes(companyFilter);
        const sumMatch = customer.sum.toString().toLowerCase().includes(sumFilter);
        const productMatch = customer.product.toLowerCase().includes(productFilter);
        return nameMatch && companyMatch && sumMatch && productMatch;
    });

    // Відображаємо відфільтрованих клієнтів
    displayCustomers(filteredCustomers);
}

// Функція для очищення фільтра
function clearFilter() {
    document.getElementById("customer-name").value = "";
    document.getElementById("customer-company").value = "";
    document.getElementById("customer-sum").value = "";
    document.getElementById("customer-product").value = "";
    // Відображаємо всіх клієнтів
    displayCustomers(customers);
}

// Обробник події для кнопки "Filter"
document.getElementById("filter-button").addEventListener("click", filterCustomers);

// Завантажуємо клієнтів з локального сховища при завантаженні сторінки
let customers = loadCustomersFromLocalStorage();

// Відображаємо список клієнтів
displayCustomers(customers);
