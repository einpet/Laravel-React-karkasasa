import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
 
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess, notifyFailure } from 'app/notify';

import { CommentForL } from './models';


/**
 * Component state.
 */
class State
{
	isInitialized : boolean = false;
	isLoading : boolean = false;
	isLoaded : boolean = false;

	comments : CommentForL[] = [];

	isDeleting : boolean = false;
	entToDel : CommentForL | null = null;

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * List the instances of the entity.
 * @returns Component HTML.
 */
function CommentList() {
	//get state container and state updater
	const [state, updateState] = useState(new State());

	//get router stuff
	const navigate = useNavigate();
	const location = useLocation();


	/**
	 * This is used to update state without the need to return new state instance explicitly.
	 * It also allows updating state in one liners, i.e., 'update(state => state.xxx = yyy)'.
	 * @param updater State updater function.
	 */
	let update = (updater : (state : State) => void) => {
		updateState(state => {
			updater(state);
			return state.shallowClone();
		})
	}

	//(re)initialize
	if( !state.isInitialized || location.state === "refresh" ) {
		//query data
		backend.get<CommentForL[]>(
			config.backendUrl + "/comment/list"
		)
		.then(resp => {
			update(state => {
				//indicate loading finished successfully
				state.isLoading = false;
				state.isLoaded = true;

				//store data loaded
				state.comments = resp.data;
			})
		})

		//drop location state to prevent infinite re-updating
		location.state = null;
		
		//indicate data is loading and initialization done
		update(state => {
			state.isLoading = true;
			state.isLoaded = false;
			state.isInitialized = true;
		});
	}

	/**
	 * Handles 'create' command.
	 */
	let onCreate = () => {
		navigate("./create");
	}

	/**
	 * Handles 'edit' command.
	 * @param id ID of the entity to edit.
	 */
	let onEdit = (id : number) => {
		navigate(`./edit/${id}`);
	}

	/**
	 * Handles 'delete' command.
	 */
	let onDelete = () => {
		update(() => {
			//close delete dialog
			state.isDeleting = false;

			//send delete request to backend
			backend.get(
				config.backendUrl + "/comment/delete",
				{
					params : {
						id : state.entToDel!.id
					}
				}
			)
			//success
			.then(resp => {
				//force reloading of entity list
				update(() => location.state = "refresh");

				//show success message
				notifySuccess("Comment deleted.");
			})
			//failure
			.catch(err => {
				//notify about operation failure
				let msg = 
					`Deletion of entity '${state.entToDel!.id}' has failed. ` +
					`either entity is not deletable or there was backend failure.`;
				notifyFailure(msg);
			})
		});
	}

	//render component html
	let html = 
		<>
		<div className="d-flex flex-column h-100">
		{ state.isLoading &&
			<div className="d-flex flex-column h-100 justify-content-center align-items-center">
				<span className="alert alert-info mx-2">Kraunami duomenys...</span>
			</div>
		}
		{ state.isInitialized && !state.isLoading && !state.isLoaded &&
			<div className="d-flex flex-column h-100 justify-content-center align-items-center">
				<span className="alert alert-warning mx-2">Backend klaida, prašome pabandyti iš naujo...</span>
			</div>
		}
		{ state.isLoaded &&
			<>			
			<div className="title"> <h2>Atsiliepimai apie įkeltus receptus</h2></div>

			<Dialog
				visible={state.isDeleting} 
				onHide={() => update(() => state.isDeleting = false)}
				header={<span className="me-2">Patvirtinkite komentaro ištrynimą.</span>}
				style={{width: "50ch"}}
				>
				<div className="alert alert-warning">Ar tikrai norite ištrinti šį komentarą?</div>
				
				<label htmlFor="id" className="form-label">ID:</label>
				<div id="id">{state.entToDel?.id}</div>

				<label htmlFor="date" className="form-label">Data:</label>
				<div id="date">{state.entToDel?.date}</div>

				<label htmlFor="name" className="form-label">Pavadinimas:</label>
				<div id="name">{state.entToDel?.name}</div>

				<label htmlFor="name" className="form-label">Receptas:</label>
				<div id="name">{state.entToDel?.fk_recipeid}</div>

				<label htmlFor="condition" className="form-label">Vertinimas:</label>
				<div id="condition">({state.entToDel?.condition} iš 10)</div>
				
				<div className="d-flex justify-content-end">
					<button 
						type="button"
						className="btn btn-primary me-2"
						onClick={() => onDelete()}
						>Patvirtinti</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => update(() => state.isDeleting = false)}
						>Atšaukti</button>
				</div>
			</Dialog>

			<div className="d-flex flex-grow-1 overflow-hidden justify-content-center align-items-center">
				<DataTable 
					value={state.comments} 
					className="with-fixes"
					paginator rows={8} rowsPerPageOptions={[8,16,32]}
					stateStorage="session" stateKey="comment-list" 
					>
					<Column field="id" header="ID"/>
					<Column field="date" header="Data"/>
					<Column field="name" header="Pavadinimas"/>
					<Column field="fk_recipeid" header="Receptas"/>
					<Column field="condition" header="Vertinimas"/>
{/* 					<Column 
						field="deletable" 
						header="Deletable"
						body={(row : CommentForL) => {
							return(<>
								<span>{row.deletable ? "Yes" : "No"}</span>
							</>);
						}}
						/> */}
					<Column 
						header="Veiksmai" 
						body={(row : CommentForL) => {
							return (<>
								<button
									type="button"
									className="btn btn-primary btn-sm mx-1"
									onClick={() => onEdit(row.id)}
									><i className="fa-solid fa-pen-to-square"></i></button>
								{ row.deletable && 
									<button
										type="button"
										className="btn btn-danger btn-sm mx-1"
										onClick={() => update(() => { state.entToDel = row; state.isDeleting = true; })}
										><i className="fa-solid fa-trash-can"></i></button>
								}
								{ !row.deletable &&
									<button
										type="button"
										className="btn btn-danger btn-sm mx-1 disabled"
										><i className="fa-solid fa-trash-can"></i></button>
								}
							</>);							
						}}
						/>
				</DataTable>
			</div>
			<div className="d-flex justify-content-center align-items-center w-100 mt-1">
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => onCreate()}
					>Pridėti atsiliepimą</button>
			</div>
			</>
		}
		</div>
		</>;

	//
	return html;
}

//
export default CommentList;