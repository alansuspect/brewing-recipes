import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class All extends Component {
  constructor() {
    super();
    this.state = {
      recipeStyle: '',
      recipeName: '',
      recipeAuthor: '',
      recipes: [],
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    const recipesRef = firebase.database().ref('recipes');
    const recipe = {
      style: this.state.recipeStyle,
      name: this.state.recipeName,
      author: this.state.user.displayName || this.state.user.email

    }
    recipesRef.push(recipe);
    this.setState({
      recipeStyle: '',
      recipeName: '',
      recipeAuthor: ''
    });
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
    const recipesRef = firebase.database().ref('recipes');
    recipesRef.on('value', (snapshot) => {
      let recipes = snapshot.val();
      let newState = [];
      for (let recipe in recipes) {
        newState.push({
          id: recipe,
          recipeStyle: recipes[recipe].style,
          recipeName: recipes[recipe].name,
          recipeAuthor: recipes[recipe].author
        });
      }
      this.setState({
        recipes: newState
      });
    });
  }

  removeItem(recipeId) {
    const recipeRef = firebase.database().ref(`/recipes/${recipeId}`);
    recipeRef.remove();
  }

  render() {
    return (
      <div className='app'>
        {this.state.user ?
          <div>
            <div className='container'>
              <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="recipeName" placeholder="Name of recipe" onChange={this.handleChange} value={this.state.recipeName} />
                  <input type="text" name="recipeStyle" placeholder="Style" onChange={this.handleChange} value={this.state.recipeStyle}  />
                  <input type="text" name="recipeAuthor" placeholder="Author" defaultValue={this.state.user.displayName || this.state.user.email}  />
                  <button>Add Recipe</button>
                </form>
              </section>
              <section className='display-item'>
                  <div className="wrapper">
                    <ul>
                      {this.state.recipes.map((recipe) => {
                        return (
                          <li key={recipe.id}>
                            <h3>{recipe.recipeName}</h3>
                            <p>{recipe.recipeStyle}</p>
                            <p>Author: {recipe.recipeAuthor}
                               {recipe.recipeAuthor === this.state.user.displayName || recipe.recipeAuthor === this.state.user.email ?
                                 <button onClick={() => this.removeItem(recipe.id)}>Delete</button> : null}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </section>
            </div>
          </div>
          :
          <div className='wrapper'>
            <p>You must be logged in to add and edit recipes.</p>
          </div>
        }

      </div>
    );
  }
}
export default All;
