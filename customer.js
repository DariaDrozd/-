document.addEventListener("DOMContentLoaded", function() {
    // Отримуємо параметр index з URL
    const urlParams = new URLSearchParams(window.location.search);
    const index = parseInt(urlParams.get('index')); // Переводимо строку в число

    // Завантажуємо дані про клієнта з локального сховища
    let customers = loadCustomersFromLocalStorage();

    // Отримуємо дані про поточного клієнта
    const customer = customers[index];

    if (customer && customer.name) {
        document.getElementById("customer-name").textContent = customer.name;
        document.getElementById("customer-company").textContent = customer.company;
        document.getElementById("customer-sum").textContent = "$" + customer.sum;
        document.getElementById("customer-product").textContent = customer.product;
        document.getElementById("customer-phone").textContent = generateRandomPhoneNumber(); // Згенеруємо випадковий номер телефону

        // Відображаємо коментарі про клієнта
        displayComments(customer.comments);

        // Додаємо обробник події для відправки коментаря
        document.getElementById("comment-form").addEventListener("submit", function(event) {
            event.preventDefault(); // Зупиняємо дію за замовчуванням

            // Отримуємо текст коментаря
            const commentText = document.getElementById("comment").value;

            // Додаємо коментар до списку коментарів клієнта
            customer.comments.push(commentText);

            // Зберігаємо оновлені дані про клієнта у локальному сховищі
            saveCustomersToLocalStorage(customers);

            // Відображаємо оновлені коментарі
            displayComments(customer.comments);

            // Очищаємо поле для введення коментаря
            document.getElementById("comment").value = "";
        });
    }
});

// Функція для відображення коментарів
function displayComments(comments) {
    const commentList = document.getElementById("comment-list");

    // Очищаємо список коментарів перед оновленням
    commentList.innerHTML = "";

    // Додаємо кожен коментар до списку
    comments.forEach(comment => {
        const li = document.createElement("li");
        li.textContent = comment;
        commentList.appendChild(li);
    });
}

// Функція для генерації випадкового номеру телефону
function generateRandomPhoneNumber() {
    const phoneNumber = "+1 " + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}



