import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {EvaluationProvider} from './context/EvaluationContext'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => (
  <Router>
    <EvaluationProvider>
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/assessment" component={Assessment} />
        <ProtectedRoute exact path="/results" component={Results} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    </EvaluationProvider>
  </Router>
)

export default App