import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CategoryTable from "./components/Category/categoryTable";
import CategoryLinksTable from "./components/CategoryLinks/categoryLinksTable";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={ <App/> } />
              <Route path="/category" element={ <CategoryTable/> } />
              <Route path="/category-links" element={ <CategoryLinksTable/> } />
          </Routes>
      </BrowserRouter>  </React.StrictMode>
);


reportWebVitals();
