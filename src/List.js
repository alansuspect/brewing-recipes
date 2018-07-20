import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class List extends Component {
  constructor() {
    super();
    this.state = {
      recipeStyle: '',
      recipeName: '',
      recipeAuthor: '',
      recipes: [],
      user: null
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
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

  componentWillMount() {
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
      <div>
            <div className='container'>
              <section className='display-item'>
                  <div className="wrapper">
                    <ul className="recipe-list">
                      {this.state.recipes.map((recipe) => {
                        return (
                          <li key={recipe.id}>
                            <h3>{recipe.recipeName}</h3>
                            <p>{recipe.recipeStyle}</p>
                            <p>Author: {recipe.recipeAuthor}</p>
                            {recipe.recipeAuthor === this.state.user.displayName || recipe.recipeAuthor === this.state.user.email ?
                              <button onClick={() => this.removeItem(recipe.id)}>Delete</button> : null}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </section>
            </div>
      </div>
    );
  }
}
export default List;
