import React, { Component } from "react";
import "./App.css";
import * as WebDataRocksReact from "./webdatarocks.react";
class App extends Component {
  render() {
    return (
      <div className="App">
        <WebDataRocksReact.Pivot
          toolbar={true}
          report="https://jsonplaceholder.typicode.com/posts/1/comments"
          // report="https://cdn.webdatarocks.com/reports/report.json"
        />
      </div>
    );
  }
}

export default App;
