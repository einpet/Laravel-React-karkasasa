/**
 * Prints some information about the app. React component.
 * @returns Component HTML.
 */
 import "./style.css";

function About() {
	//render component html
	let html = 
		<>
    <main className="page">
      <header className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <h1>receptai</h1>
            <h4>greitai ir lengvai</h4>
          </div>
        </div>
      </header>
      <section className="recipes-container">
        <div id="contentLeft">
          <h4>Receptai</h4>
          <ul>
            <li><a href="recipes.html">Salotos</a></li>
            <li><a href="recipes.html">Mėsos patiekalai</a></li>
            <li><a href="recipes.html">Pusryčiai</a></li>
            <li><a href="recipes.html">Desertai</a></li>
         </ul>
        </div>
        <div className="recipes-list">
          <a href="recipe.html" className="recipe">
            <img
              src="./assets/recipes/recipe-1.jpeg"
              className="img recipe-img"
              alt=""
            />
            <h5>Kugelis</h5>
            <p>Paruošimas: 30min | Gaminimas: 120min</p>
          </a>
          
          <a href="recipe.html" className="recipe">
            <img
              src="./assets/recipes/recipe-2.jpeg"
              className="img recipe-img"
              alt=""
            />
            <h5>Šaltibarščiai</h5>
            <p>Paruošimas: 30min | Gaminimas: 120min</p>
          </a>
          <a href="recipe.html" className="recipe">
            <img
              src="./assets/recipes/recipe-3.jpeg"
              className="img recipe-img"
              alt=""
            />
            <h5>Avižinė košė</h5>
            <p>Paruošimas: 30min | Gaminimas: 60min</p>
          </a>
          <a href="recipe.html" className="recipe">
            <img
              src="./assets/recipes/recipe-4.jpeg"
              className="img recipe-img"
              alt=""
            />
            <h5>Amerikietiški blyneliai</h5>
            <p>Paruošimas:<i className="fas fa-clock"></i> 15min | Gaminimas: 20min</p>
          </a>
    
          <a href="recipe.html" className="recipe">
            <img
              src="./assets/recipes/recipe-4.jpeg"
              className="img recipe-img"
              alt=""
            />
            <h5>Amerikietiški blyneliai</h5>
            <p>Paruošimas: 15min | Gaminimas: 20min</p>
          </a>
          <a href="recipe.html" className="recipe">
            <img
              src="./assets/recipes/recipe-4.jpeg"
              className="img recipe-img"
              alt=""
            />
            <h5>Amerikietiški blyneliai</h5>
            <p>Paruošimas: 15min | Gaminimas: 20min</p>
          </a>
        </div>
      </section>
    </main>
		</>

	//
	return html;
}

//
export default About;