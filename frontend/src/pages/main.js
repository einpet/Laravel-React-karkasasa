import React from 'react';

class Main extends React.Component{
render(){
    return (
    <div class="page">
      <header class="hero">
        <div class="hero-container">
          <div class="hero-text">
            <h1>receptai</h1>
            <h4>greitai ir lengvai</h4>
          </div>
        </div>
      </header>
        <div id="contentLeft">
          <h4>Receptai</h4>
          <ul>
            <li><a href="recipes.html">Salotos</a></li>
            <li><a href="recipes.html">Mėsos patiekalai</a></li>
            <li><a href="recipes.html">Pusryčiai</a></li>
            <li><a href="recipes.html">Desertai</a></li>
         </ul>
        </div>
        <div class="recipes-list">
          <a href="recipe.html" class="recipe">
            <img
              src="./assets/recipes/recipe-1.jpeg"
              class="img recipe-img"
              alt=""
            />
            <h5>Kugelis</h5>
            <p>Paruošimas: 30min | Gaminimas: 120min</p>
          </a>
        </div>
    </div>
);
}
}
export default Main;