import { NavLink } from "react-router-dom";
import Logo from './logo.png';
import Auth from 'auth/Auth';

import './NavMenu.scss'


/**
 * Navigation menu. React component.
 * @returns Component HTML.
 */
function NavMenu() {
	//render component HTML
	let html =		
		<header>
			    <link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
				/>
				<nav 
				className="
					navbar 
					shadow-sm bg-body rounded m-1 
					d-flex justify-content-between align-items-center"
				>
				<div>
				{/* 👇️ local image */}
				<img src={Logo} alt="logo" className="nav-logo" />
				</div>
				<span className="d-flex">
					<NavLink 
						to="/" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Pagrindinis</NavLink>
					<NavLink 
						to="/commentCrud" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Apie</NavLink>
					<NavLink 
						to="/commentCrud" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Atsiliepimai</NavLink>
				</span>
				<span>
					<Auth/>
				</span>
			</nav>
		</header>;

	//
	return html;
}

//export component
export default NavMenu;