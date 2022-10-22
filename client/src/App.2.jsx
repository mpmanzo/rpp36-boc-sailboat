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
import Login from './Pages/Login.jsx';

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
  }

  // componentDidMount() {
  //   let categories = [];
  //   axios.get('/categories', {
  //     params: {
  //       id: this.state.userID
  //     }
  //   })
  //   .then(result => result.data.map((option, i) => {
  //     return categories.push({key: option.category, value: option.category_id})
  //   }))
  //   .then(this.setState({
  //     categories: categories
  //   }))
  // }

  render() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
    );
  }
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);

export default App;
