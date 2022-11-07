import { Routes, Route } from 'react-router-dom'

import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
import CommentEdit from './CommentEdit';


/**
 * CRUD operations on a single kind of Comment. This component defines a router for 
 * components of concrete operations. React component.
 * @returns Component HTML.
 */
function CommentCrud() {
	//render component html
	let html = 
		<>
		<Routes>
			<Route path="/" element={<CommentList/>}/>
			<Route path="/create" element={<CommentCreate/>}/>
			<Route path="/edit/:commentId" element={<CommentEdit/>}/>
		</Routes>
		</>

	//
	return html;
}

//
export default CommentCrud;