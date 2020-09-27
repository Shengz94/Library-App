
/* Library */

function library(){
    this.books = [];
    this.lastId = 1;
}

library.prototype.addToLibrary = function(book){
    if(!this.books.some( b =>  {
        return b.name == book.name && 
        b.author == book.author &&
        b.pages == book.pages
    } )){
        this.books.push(book);
        return true;
    }
    else
        return false
    
}

library.prototype.getNewId = function(){
    /*let id = getRandomInt(1, 99999);
    
    while (myLibrary.some( b => b.id == id )){
        id = getRandomInt(1, 99999);
    }

    return id;*/
    this.lastId++;
    return this.lastId;
}

/* Book */

function book(id, name, author, pages, read){
    this.id = id;
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

book.prototype.info = function(){
    readText = this.read ? 'already read' : 'not read yet'; 
    return name + ' by ' + this.author + ', ' + this.pages + ' pages, ' + readText;
}

/* helpers */

var myLibrary = new library();
const libraryView = document.querySelector('.book-list tbody');


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validate(){
    let nameValue = document.getElementById('nameInput').value;
    let pagesValue = document.getElementById('pagesInput').value;
    let error = true;

    if(nameValue.length <= 0){
        showText('Name can\'t be empty.', 'red');
        error = false;
    }
    if ( !(pagesValue > 0)){
        showText('Pages not a number or smaller than 0.', 'red')
        error = false;
    }

    return error;
}

function showText(text, color){
    let resultView = document.querySelector('div.result-text');
    textNode = document.createElement('div')
    textNode.className = 'temporal-message';
    textNode.style.cssText = 'color: ' + color;
    textNode.textContent = text;

    resultView.appendChild(textNode);

    setTimeout(() => {
        let message = document.querySelector('div.temporal-message');

        if(message != null)
            message.parentNode.removeChild(message);
    }, 3000);

}

function createBook(){

    if(validate()){
        let nameValue = document.getElementById('nameInput').value;
        let authorValue = document.getElementById('authorInput').value.length > 0 ?
                        document.getElementById('authorInput').value:
                        'Anonymous';
        let pagesValue = document.getElementById('pagesInput').value;
        let readValue = document.getElementById('readInput').checked;
        let id = myLibrary.getNewId();
        let b = new book(id, nameValue, authorValue, pagesValue, readValue);

        if(myLibrary.addToLibrary(b)){
            saveData();
            addBookToView(b);
            showText('Book added to library.', 'green');
        }
        else{
            showText('Book duplicated.', 'red');
        }
    }
        

}

function addBookToView(b){
    let row = document.createElement('tr');
    let name = document.createElement('td');
    let author = document.createElement('td');
    let pages = document.createElement('td');
    let read = document.createElement('td');
    let remove = document.createElement('td');

    row.id =  'book-' + b.id;
    name.class = 'book-name';
    author.class = 'book-author';
    pages.class = 'book-pages';
    read.class = 'read-name';
    

    let nameText = document.createTextNode(b.name);
    let authorText = document.createTextNode(b.author);
    let pagesText = document.createTextNode(b.pages);
    let readTextDiv = document.createElement('div')
    let readText = b.read ? document.createTextNode('Already read') : 
                    document.createTextNode('Not read yet');
    let readBox = document.createElement('input');
    let removeButton = document.createElement('input');

    readTextDiv.id = 'book-' + b.id + '-read';
    readTextDiv.appendChild(readText);
    readBox.type = 'checkbox';
    readBox.checked = b.read;
    readBox.onclick = function(){
        tdId = this.parentElement.parentElement.id;
        bookId = tdId.split('-')[1];
        myLibrary.books.find(b => b.id == bookId).read = this.checked;

        readText = document.querySelector('#' + tdId + '-read');
        if (this.checked)
            readText.textContent = 'Already read';
        else
            readText.textContent = 'Not read yet';
        saveData();
    }
    removeButton.type = 'button';
    removeButton.value = 'Remove';
    removeButton.onclick = function(){ 
        bookId = this.parentElement.parentElement.id.split('-')[1];
        this.parentElement.parentElement.parentElement.removeChild(
            this.parentElement.parentElement);
        myLibrary.books = myLibrary.books.filter(b => b.id != bookId);
        saveData();
    };
    
    name.appendChild(nameText);
    author.appendChild(authorText);
    pages.appendChild(pagesText);
    read.appendChild(readBox);
    read.appendChild(readTextDiv);
    remove.appendChild(removeButton);

    row.appendChild(name);
    row.appendChild(author);
    row.appendChild(pages);
    row.appendChild(read);
    row.appendChild(remove);

    libraryView.appendChild(row);
}


function updateLibraryView(){
    for(var i = 0; i < myLibrary.books.length; i++){
        addBookToView(myLibrary.books[i]);
    }
}

function saveData(){
    localStorage.setItem('BookTrackerLibrary', JSON.stringify(myLibrary.books));
}

function loadData(){
    rawData = localStorage.getItem('BookTrackerLibrary');
    if(rawData != null)
        myLibrary.books = JSON.parse(rawData);
}

/* */



function addExamples(){
    myLibrary.addToLibrary( new book(myLibrary.getNewId(), 'book1', 'author1', 243, false));
    myLibrary.addToLibrary( new book(myLibrary.getNewId(), 'book2', 'author2', 242, false));
    myLibrary.addToLibrary( new book(myLibrary.getNewId(), 'book3', 'author3', 243, true));
    myLibrary.addToLibrary( new book(myLibrary.getNewId(), 'book4', 'author4', 244, false));
    myLibrary.addToLibrary( new book(myLibrary.getNewId(), 'book5', 'author5', 245, true));
    myLibrary.addToLibrary( new book(myLibrary.getNewId(), 'book6', 'author6', 246, false));
    myLibrary.addToLibrary( new book(myLibrary.getNewId(), 'book7', 'author7', 247, false));
}


loadData();
//addExamples();
updateLibraryView();