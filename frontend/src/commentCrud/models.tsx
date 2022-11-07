
/**
 * Entity for lists.
 */
interface CommentForL {
	id: number;
	date: string;
	name: string;
	fk_recipeid: number;
	condition: number;
	deletable: boolean;
}

/**
 * Entity for creating and updating.
 */
class CommentForCU {
	id: number = -1;
	date: string = "";
	name: string = "";
	fk_recipeid: number = 0;
	condition: number = 0;
	deletable: boolean = false;
}

//
export type {
	CommentForL
}

export {
	CommentForCU
}