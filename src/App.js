import "./App.css";
import { Switch, Route} from "react-router-dom";

const App = () => {
  document.title = "HOME";
  return (
    <Switch>
      <Route exact path="/"> {/** To display exact page with path / */}
        <div>Home</div>
      </Route>
      <Route exact path="/:id"> {/** To display exact page with path that contains a dynamic value EX: /1, /12sxxas23 */}
        <div>Dynamic page</div>
      </Route>
      <Route render={()=><h1>404 Not found</h1>} /> {/** To display not found page if the url not match any of the above URLS */}
    </Switch>
  );
};

export default App;
