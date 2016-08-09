import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function createStore(reducer){
  let state;
  const getState = () => {
    return state
  }
  const dispatch = (action) => {
    state = reducer(state, action)
    render()
  }
  state = reducer(state, {})
  return {getState, dispatch}
}

function booksReducer(state = [{id: 1, name: 'Harry Potter', authorID: 1}], action) {
  switch (action.type) {
    case 'ADD_BOOK':
      return [
        ...state,
        {
          id: state.length + 1,
          name: action.name,
          authorID: Number(action.authorID)
        }
      ]
    case 'REMOVE_BOOK':

    let bookForDeletion =state.filter((book)=>book.id === action.id)[0]
    let idx = state.indexOf(bookForDeletion)

        return [
          ...state.slice(0, idx),
          ...state.slice(idx + 1)
        ]
    default:
      return state
  }
}

function authorsReducer(state = [{id: 1, name: 'JK Rowling'}], action) {
  switch (action.type) {
    case 'ADD_AUTHOR':
      return [
        ...state,
        {
          id: state.length + 1,
          name: action.name
        }
      ]
    default:
      return state
  }
}


// function visibilityFilter(state = 'HIDDEN', action) {
//   switch (action.type) {
//     case SET_VISIBILITY_FILTER:
//       return action.filter
//     default:
//       return state
//   }
// }

function literatureApp(state = {}, action) {
  return {
    authors: authorsReducer(state.authors, action),
    books: booksReducer(state.books, action)
  }
}

const store = createStore(literatureApp)

class App extends Component {
  render() {
    return (
      <div>
        <AuthorForm storeDispatch={this.props.storeDispatch}/>
        <BookForm storeDispatch={this.props.storeDispatch} list={this.props.data.authors}/>
        <AuthorList list={this.props.data.authors} books={this.props.data.books} storeDispatch={this.props.storeDispatch}/>
      </div>
    )
  }
}

class BookForm extends Component {
  bookSubmit(event) {
    event.preventDefault()
    var authorID = this.refs.authors.value
    var name = this.refs.book.value
    this.props.storeDispatch({type: 'ADD_BOOK', name: name, authorID: authorID})
  }
  render() {
    var authors = this.props.list.map((author) => <option value={author.id}>{author.name}</option>)
    return (
      <form id='bookForm' onSubmit={this.bookSubmit.bind(this)}>
        <h3>ADD A BOOK</h3>
        <input type='text' ref='book'></input>
        <select name="authorList" ref='authors'>
          {authors}
        </select>
        <input type='submit'></input>
      </form>
    )
  }
}

class AuthorForm extends Component {
  submitAuthor(event) {
    event.preventDefault()
    this.props.storeDispatch({type: 'ADD_AUTHOR', name: this.refs.nameInput.value})
  }
  render() {
    return (
      <div>
        <form onSubmit={this.submitAuthor.bind(this)}>
          <h3>ADD AN AUTHOR!</h3>
          Name: <input ref='nameInput' type='text'></input>
          <input type='submit'></input>
        </form>
      </div>
    )
  }
}

class AuthorList extends Component {
  filterBooks(author) {
    return this.props.books.filter((book) => {return author.id === book.authorID})
  }
  render() {
    var authorList = this.props.list.map((author) => {
      return <Author id={author.id} name={author.name} books={this.filterBooks(author)} storeDispatch={this.props.storeDispatch}/>
    }, this)
    return (
      <div>
        {authorList}
      </div>
    )
  }
}

class Author extends Component {
  render() {
    var books = this.props.books.map((book) => <Book  storeDispatch={this.props.storeDispatch} id={book.id} name={book.name} authorID={book.authorID}/>)
    return (
      <div ref={`author${this.props.id}`}>
        <h3>{this.props.name}</h3>
        <ul>
          {books}
        </ul>
      </div>
    )
  }
}

class Book extends Component {
  deleteBook(event){
    event.preventDefault()
    this.props.storeDispatch({type:'REMOVE_BOOK' , id:this.props.id})
  }
  render() {
    return (
        <li>{this.props.name} <button onClick={this.deleteBook.bind(this)}>Remove this book</button> </li>
    )
  }
}

function render(){
  ReactDOM.render(
  <App data={store.getState()} storeDispatch={store.dispatch}/>,
  document.getElementById('root')
 );
}

render()
