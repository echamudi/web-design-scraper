// let page = document.getElementById('buttonDiv');

// const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
// function constructOptions(kButtonColors: any) {
//   if (page === null) throw new Error();

//   for (let item of kButtonColors) {
//     let button = document.createElement('button');
//     button.style.backgroundColor = item;
//     button.addEventListener('click', function() {
//       chrome.storage.sync.set({color: item}, function() {
//         console.log('color is ' + item);
//       })
//     });
//     page.appendChild(button);
//   }
// }
// constructOptions(kButtonColors);

import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <h1>Web Design Scraper Preferences</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
