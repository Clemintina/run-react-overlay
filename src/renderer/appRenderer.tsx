import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@misc/window/components/WindowFrame';
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TitleBar from "@components/Titlebar";
import App from "@renderer/views/App";
import MainSettings from "@renderer/views/MainSettings";
import store from '@common/store';
import {initScript} from "@common/store/ConfigStore";

// Load config
setTimeout(() => store.dispatch(initScript()), 20);

// Application to Render
const app = (
  <WindowFrame title='Seraph Overlay' platform='windows'>
      <React.StrictMode>
          <Provider store={store}>
              <div style={{width: window.innerWidth - 20}} className='mainBody'>
                  <BrowserRouter>
                      <TitleBar/>
                      <Routes>
                          <Route path="/" element={<App/>}/>
                          <Route path="*" element={<App/>}/>
                          <Route path="settings" element={<MainSettings/>}/>
                      </Routes>
                  </BrowserRouter>
              </div>
          </Provider>
      </React.StrictMode>
  </WindowFrame>
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
