import React from 'react';
import axios from 'axios';
import Form from './Form';
import TodoList from './TodoList';

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleteds: true,
  }

  onTodoNameInputChange = evt => {
    const { value } = evt.target;
    this.setState({ ...this.state, todoNameInput: value })
  }
  resetForm = () => this.setState({ ...this.state, todoNameInput: ''})
  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
    .then(res => {
      this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
      this.resetForm()
    })
    .catch(err => {
      this.setState({ ...this.state, error: err.response.data.message })
    })
  }

  onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo()
  }

  fetchAllTodos = () => {
    axios.get(URL)
    .then(res => {
      this.setState({ ...this.state, todos: res.data.data })
    })
    .catch(err => {
      this.setState({ ...this.state, error: err.response.data.message })
    })
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
      this.setState({
        ...this.state, todos: this.state.todos.map(td => {
          if (td.id !== id) return td
          return res.data.data
        })
      })
    })
    .catch(err => {
      this.setState({ ...this.state, error: err.response.data.message })
    })
  }

  toggleDisplayCompleteds = () => {
    this.setState({ ...this.state, displayCompleteds: !this.state.displayCompleteds })
  }

  componentDidMount() {
    // fetch all todos from the server
    this.fetchAllTodos()
  }



  render() {
    return (
      <div>
        <div id="error">Error: {this.state.error}</div>
        <TodoList
          toggleCompleted={this.toggleCompleted}
          todos={this.state.todos}
          displayCompleteds={this.state.displayCompleteds}
        />
        <Form
          onTodoFormSubmit={this.onTodoFormSubmit}
          onTodoNameInputChange={this.onTodoNameInputChange}
          toggleDisplayCompleteds={this.toggleDisplayCompleteds}
          todoNameInput={this.state.todoNameInput}
          displayCompleteds={this.state.displayCompleteds}
        />
      </div>
    )
  }
}
