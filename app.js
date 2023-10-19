const books = JSON.parse(localStorage.getItem('books')) || [];

function updateLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

function renderBooks(filteredBooks = []) {
    const unreadBooks = document.getElementById('unread-books');
    const readBooks = document.getElementById('read-books');
    unreadBooks.innerHTML = '';
    readBooks.innerHTML = '';

    const booksToRender = filteredBooks.length > 0 ? filteredBooks : books;

    booksToRender.forEach((book) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun Terbit: ${book.year}</p>
            <p>Status: ${book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca'}</p>
            <button onclick="moveBook(${book.id})">${book.isComplete ? 'Pindahkan ke Belum Selesai' : 'Pindahkan ke Selesai'}</button>
            <button onclick="deleteBook(${book.id})">Hapus</button>
            <button onclick="showEditForm(${book.id})">Edit</button>
        `;

        if (book.isComplete) {
            readBooks.appendChild(bookElement);
        } else {
            unreadBooks.appendChild(bookElement);
        }
    });
}

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value, 10);
    const isComplete = document.getElementById('isComplete').checked;
    const id = +new Date();

    const book = {
        id,
        title,
        author,
        year,
        isComplete
    };

    books.push(book);
    updateLocalStorage();
    renderBooks();

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isComplete').checked = false;
}

function moveBook(id) {
    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        updateLocalStorage();
        renderBooks();
    }
}

function deleteBook(id) {
    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        updateLocalStorage();
        renderBooks();
    }
}

function showEditForm(id) {
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex !== -1) {
        const book = books[bookIndex];
        const bookContainer = book.isComplete ? document.getElementById('read-books') : document.getElementById('unread-books');

        const editForm = document.createElement('div');
        editForm.classList.add('book');
        editForm.innerHTML = `
            <h3>Edit Buku</h3>
            <input type="text" id="edit-title" value="${book.title}" required>
            <input type="text" id="edit-author" value="${book.author}" required>
            <input type="number" id="edit-year" value="${book.year}" required>
            <label for="edit-isComplete">Selesai dibaca</label>
            <input type="checkbox" id="edit-isComplete" ${book.isComplete ? 'checked' : ''}>
            <button onclick="saveEdit(${book.id})">Simpan</button>
            <button onclick="cancelEdit(${book.id})">Batal</button>
        `;

        bookContainer.replaceChild(editForm, bookContainer.children[bookIndex]);
    }
}

function saveEdit(id) {
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex !== -1) {
        const title = document.getElementById('edit-title').value;
        const author = document.getElementById('edit-author').value;
        const year = parseInt(document.getElementById('edit-year').value);
        const isComplete = document.getElementById('edit-isComplete').checked;

        if (!isNaN(year)) {
            books[bookIndex] = {
                ...books[bookIndex],
                title,
                author,
                year,
                isComplete
            };
            updateLocalStorage();
            renderBooks();
        } else {
            alert('Tahun harus berupa angka.');
        }
    }
}

function cancelEdit(id) {
    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
        editBook(id);
    }
}

document.getElementById('addBook').addEventListener('click', addBook);

renderBooks();

document.getElementById('search').addEventListener('input', () => {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue)
    );
    renderBooks(filteredBooks);
});