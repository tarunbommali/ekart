import React from 'react';
import { Outlet } from 'react-router-dom';
import Home from './routes/Home';

const AppLayout = () => <Outlet />;

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home/> },
    ],
  },
];

export default routes;
