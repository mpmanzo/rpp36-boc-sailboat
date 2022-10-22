import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import SignIn from "./Components/Accounts/SignIn.jsx";
import SignUp from "./Components/Accounts/SignUp.jsx";
import Metrics from "./Components/Metrics/index.jsx";
import CalendarClass from "./Components/Calendar.jsx";
import TodoCreate from './Components/Forms/TodoCreate.jsx';
import TodoList from './Components/CalendarInteraction/TodoList.jsx';
import CategoryCreate from './Components/Forms/CategoryCreate.jsx';
import DeleteButton from './Components/Forms/DeleteButton.jsx';
import AppointmentShare from './Components/Appointments/AppointmentShare.jsx';
import Modal from 'react-modal';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

Modal.setAppElement('#app');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1,
      todoID: 104,
      todos: [],
      categories: [
        {key: 'None', value: 0},
        {key: 'Option 1', value: 1},
        {key: 'Option 2', value: 2},
        {key: 'Option 3', value: 3},
        {key: 'Option 4', value: 4},
        {key: 'Option 5', value: 5},
        {key: 'Other', value: 6}
      ],
      currentEvents: [{id: 4, title: 'newEvent', date: '2022-10-17'}]
    };
  }

  componentDidMount() {
    axios.get('/todos', {
      params: {
        id: this.state.userID
      }
    })
    .then(result => {
      this.setState({...this.state, todos: result.data});
    })

    axios.get('/categories', {
      params: {
        id: this.state.userID
      }
    })
    .then(result => {
      const categories = result.data.map((option, i) => {
        return {key: option.category, value: option.category_id}
      });
      this.setState({...this.state, categories})
    });
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
      <Router>
        <div>
          <div>Encompass</div>
          <SignIn onClick={this.signInUser} />
          <SignUp onClick={this.signUpUser} />
          <Metrics />
          <Routes>
            <Route exact path="/" element={<CalendarClass events={this.state.currentEvents} userID={this.state.userID} />} />
            <Route path="/share/appointment" element={<AppointmentShare userID={this.state.userID} />} />
          </Routes>
          <h1>THIS CREATES A TODO ENTRY</h1>
          <TodoCreate userID={this.state.userID} categories={this.state.categories}/>
          <h1>THIS CREATES A CATEGORY</h1>
          <CategoryCreate userID={this.state.userID}/>
          <h1>THIS DELETES SOMETHING</h1>
          <DeleteButton todoID={this.state.todoID}/>
          <TodoList todos={this.state.todos} />
        </div>
      </Router>
    );
  }
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);

export default App;
