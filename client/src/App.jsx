import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import SignIn from "./Components/Accounts/SignIn.jsx";
import SignUp from "./Components/Accounts/SignUp.jsx";
import Metrics from "./Components/Metrics/index.jsx";
import CalendarClass from "./Components/Calendar.jsx";
import TodoCreate from './Components/Forms/TodoCreate.jsx';
import CategoryCreate from './Components/Forms/CategoryCreate.jsx';
import Modal from 'react-modal';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Pages/Layout.jsx';
import Home from './Pages/Home.jsx';

Modal.setAppElement('#app');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1,
      categories: [
        {key: 'None', value: 0},
        {key: 'Option 1', value: 1},
        {key: 'Option 2', value: 2},
        {key: 'Option 3', value: 3},
        {key: 'Option 4', value: 4},
        {key: 'Option 5', value: 5},
        {key: 'Other', value: 6}
      ],
      currentEvents: [{title: 'newEvent', date: '2022-10-17'}]
    };
    this.getUser = this.getUser.bind(this);
    this.signInUser = this.signInUser.bind(this);
    this.signUpUser = this.signUpUser.bind(this);
  }

  componentDidMount() {
    let categories = [];
    axios.get('/categories', {
      params: {
        id: this.state.userID
      }
    })
    .then(result => result.data.map((option, i) => {
      return categories.push({key: option.category, value: option.category_id})
    }))
    .then(this.setState({
      categories: categories
    }))
  }

  getUser () {
    axios({
      method: 'GET',
      data: {
        email: email,
        password: password,
      },
      withCredentials: true,
      url: '/user',
    }).then((res) => console.log(res));
  }

  signInUser (user) {
    console.log('App: ', user);
    axios({
      method: 'POST',
      data: {
        email: user.email,
        password: user.password,
      },
      withCredentials: true,
      url: '/auth/signin',
    }).then((res) => console.log(res));
  }

  signUpUser (user) {
    console.log('App: ',user);
    axios({
      method: 'POST',
      params: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
      },
      withCredentials: true,
      url: '/auth/signup',
    }).then((res) => console.log(res));
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
            <Route exact path='/auth'>
              <Route path='/auth/signin' element={<SignIn onClick={this.signInUser} />} />
              <Route path='/auth/signup' element={<SignUp onClick={this.signUpUser} />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <div>
          <div>Encompass</div>
          <Metrics />
          <CalendarClass events={this.state.currentEvents}/>
          <h1>THIS CREATES A TODO ENTRY</h1>
          <TodoCreate userID={this.state.userID} categories={this.state.categories}/>
          <h1>THIS CREATES A CATEGORY</h1>
          <CategoryCreate userID={this.state.userID}/>
        </div>
      </>
    );
  }
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);

export default App;
