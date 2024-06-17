import React, { } from 'react';
import AppRouter from './routes/AppRouter';
import Login from './Login';


function App() {


  return (
    <div className='flex flex-col min-h-screen'>

      <main className='w-full mx-auto '>
        <Login />
      </main>

    </div>
  );
}

export default App;