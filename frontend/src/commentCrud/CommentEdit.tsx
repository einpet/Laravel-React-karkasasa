import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Rating } from 'primereact/rating';
import { Checkbox } from 'primereact/checkbox';
  
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess } from 'app/notify';

import { CommentForCU } from './models';


/**
 * Component state.
 */
class State
{	
	isInitialized : boolean = false;
	isLoading : boolean = false;
	isLoaded : boolean = false;

	id : number = -1;
	date: Date  = new Date(Date.now());
	name: string = "";
	fk_recipeid: number = 0;
	condition : number = 0;
	deletable : boolean = true;

	isNameErr : boolean = false;
	isSaveErr : boolean = false;

	/**
	 * Resets error flags to off.
	 */
	resetErrors() {
		this.isNameErr = false;
		this.isSaveErr = false;
	}

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * Log-in section in nav bar. React component.
 * @returns Component HTML.
 */
function CommentEdit() {
	//get state container and state updater
	const [state, setState] = useState(new State());

	//get router stuff
	const navigate = useNavigate();
	const locationParams = useParams();

	/**
	 * This is used to update state without the need to return new state instance explicitly.
	 * It also allows updating state in one liners, i.e., 'update(state => state.xxx = yyy)'.
	 * @param updater State updater function.
	 */
	let update = (updater : () => void) => {
		updater();
		setState(state.shallowClone());
	}

	let updateState = (updater : (state : State) => void) => {
		setState(state => {
			updater(state);
			return state.shallowClone();
		})
	}

	//initialize
	if( !state.isInitialized ) {
		//query data
		backend.get<CommentForCU>(
			config.backendUrl + `/comment/load`,
			{
				params : {
					id : locationParams["commentId"]
				}
			}
		)
		.then(resp => {
			updateState(state => {
				//indicate loading finished successfully
				state.isLoading = false;
				state.isLoaded = true;

				//store data loaded
				let data = resp.data;

				state.id = data.id;
				state.date = new Date(data.date);
				state.name = data.name;
				state.fk_recipeid = data.fk_recipeid;
				state.condition = data.condition;
				state.deletable = data.deletable;
			})
		})

		//indicate data is loading and initialization done
		update(() => {
			state.isLoading = true;
			state.isLoaded = false;
			state.isInitialized = true;
		});
	}

	/**
	 * Handles'save' command.
	 */
	let onSave = () => {
		update(() => {
			//reset previous errors
			state.resetErrors();

			//validate form
			if( state.name.trim() === "" )
				state.isNameErr = true;

			//errors found? abort
			if( state.isNameErr )
				return;

			//drop timezone from date, otherwise we will see wrong dates when they come back from backend
			let localDate = new Date(state.date.getTime() - state.date.getTimezoneOffset() * 60 *1000);

			//collect comment data
			let comment = new CommentForCU();
			comment.id = state.id;
			comment.name = state.name;
			comment.date = localDate.toISOString();
			comment.fk_recipeid = state.fk_recipeid;
			comment.condition = state.condition;
			comment.deletable = state.deletable;

			//request comment creation
			backend.post(
				config.backendUrl + "/comment/update",
				comment
			)
			//success
			.then(resp => {
				//redirect back to comment list on success
				navigate("./../../", { state : "refresh" });

				//show success message
				notifySuccess("comment updated.");
			})
			//failure
			.catch(err => {
				updateState(state => state.isSaveErr = true);
			});
		});		
	}

	//render component html
	let html = 
		<>
		<div className="d-flex flex-column h-100 overflow-auto">
			<div className="mb-1">Editing comment</div>
			{ state.isLoading &&
				<div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
					<span className="alert alert-info mx-2">Kraunami duomenys...</span>
				</div>
			}
			{ state.isInitialized && !state.isLoading && !state.isLoaded &&
				<div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
					<span className="alert alert-warning mx-2">Backend failure, please try again...</span>
				</div>
			}
			{ state.isLoaded &&
				<>
				<div className="d-flex justify-content-center">
					<div className="d-flex flex-column align-items-start" style={{width: "80ch"}}>					
						{state.isSaveErr &&
							<div 
								className="alert alert-warning w-100"
								>Saving failed due to backend failure. Please, wait a little and retry.</div>
						}	

						<label htmlFor="id" className="form-label">ID:</label>
						<span id="id">{state.id}</span>

						<label htmlFor="date" className="form-label">Date:</label>
						<Calendar
							id="date"
							className="form-control"
							value={state.date}		
							onChange={(e) => update(() => state.date = e.target.value as Date)}				
							dateFormat="yy-mm-dd"
							/>

						<label htmlFor="name" className="form-label">Name:</label>
						<InputText 
							id="name" 
							className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
							value={state.name}
							onChange={(e) => update(() => state.name = e.target.value)}
							/>
						{state.isNameErr && 
							<div className="invalid-feedback">Name must be non empty and non whitespace.</div>
						}

						<label htmlFor="fk_recipeid" className="form-label">Receptas:</label>
						<InputNumber 
							id="fk_recipeid" 
							className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
							value={state.fk_recipeid}
							onChange={(e) => update(() => state.fk_recipeid = e.value!)}
							/>
						{state.isNameErr && 
							<div className="invalid-feedback">Name must be non empty and non whitespace.</div>
						}

						<label htmlFor="condition" className="form-label">Condition:</label>
						<span className="d-flex align-items-center">
							<Rating
								id="condition"
								stars={10}
								value={state.condition}
								onChange={(e) => update(() => state.condition = e.target.value ?? 0)}
								/>
							<span className="ms-2 ">({state.condition} out of 10)</span>
						</span>

						<label htmlFor="deletable" className="form-label">Deletable</label>
						<Checkbox
							checked={state.deletable}
							onChange={() => update(() => state.deletable = !state.deletable)}
							/>

					</div>
				</div>

				<div className="d-flex justify-content-center align-items-center w-100 mt-1">
					<button
						type="button"
						className="btn btn-primary mx-1"
						onClick={() => onSave()}
						><i className="fa-solid fa-floppy-disk"></i> Save</button>
					<button
						type="button"
						className="btn btn-primary mx-1"
						onClick={() => navigate("./../../")}
						><i className="fa-solid fa-xmark"></i> Cancel</button>
				</div>
				</>
			}
		</div>
		</>;

	//
	return html;
}

//
export default CommentEdit;