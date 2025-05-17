import React from "react"
import RouterSetup from "./routes/RouterSetup"
import { Provider } from "react-redux";

import store from "./redux/store"
function App() {

  return (
        <Provider store={store}>

      <RouterSetup/> 
    </Provider>
  )
}

export default App
