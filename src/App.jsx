import { useRoutes } from "react-router-dom";
import Router from "./router";
import AuthRouter from "./router/AuthRouter";

function App() {
  return (
    <div className="App">
      <AuthRouter>
        <Router></Router>
      </AuthRouter>
    </div>
  );
}

export default App;
