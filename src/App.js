import {Switch, Route, Redirect} from 'react-router-dom'

import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import PopularRoute from './components/PopularRoute'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import MovieItemDetails from './components/MovieItemDetails'
import SearchRoute from './components/SearchRoute'
import AccountRoute from './components/AccountRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginRoute} />
    <ProtectedRoute exact path="/" component={HomeRoute} />
    <ProtectedRoute exact path="/popular" component={PopularRoute} />
    <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />

    <ProtectedRoute exact path="/search" component={SearchRoute} />
    <ProtectedRoute exact path="/account" component={AccountRoute} />

    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
