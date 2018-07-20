import React, { Component } from 'react';
import Sidebar from './Sidebar';
import Add from './Add';
import List from './List';
import { Container, Row, Col } from 'reactstrap';
import { BrowserRouter, Route } from 'react-router-dom';
import firebase, { auth, provider } from './firebase.js';

export default class App extends Component {
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


  render() {
    return (

      <BrowserRouter>
        <Container fluid>
        <Row>
          <Col>
            <header>
                <div className='wrapper'>
                  <h1>Brewing Recipes</h1>
                  {this.state.user ?
                    <div>
                      <div className='user-profile'>
                         <img src={this.state.user.photoURL} alt="" />
                      </div>
                      <button onClick={this.logout}>Log Out</button>
                    </div>
                    :
                    <button onClick={this.login}>Log In</button>
                  }
                </div>
            </header>
          </Col>
        </Row>
        {this.state.user ?
          <div>
            <Row className="full-height">
              <Col sm="3"><Sidebar /></Col>
              <Col sm="9">
              <Route exact path='/' component={List}/>
              <Route path='/add' component={Add}/>
              </Col>
            </Row>
          </div>
          :
          <div className='wrapper'>
            <p>You must be logged in to add and edit recipes.</p>
          </div>
        }



        </Container>
      </BrowserRouter>



    );
  }
}
