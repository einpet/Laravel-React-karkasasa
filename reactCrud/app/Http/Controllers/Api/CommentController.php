<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CommentController extends Controller
{
    // this should be implemented in lab3
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return response()->json(
            Comment::all()->toArray()
        );
        // More laravel way of writing return are displayed below the above is adapted to React App created with .Net as backend in mind
        // return CommentResource::collection(Comment::all());
    }

    public function store(CommentRequest $request)
    {
        $comments = Comment::create($request->validated());

        return response()->json([
            'status' => 'success',
            'comments' => $comments,
        ]);
    }

    public function show(Request $request)
    {
        $id = $request->query('id');
        try{
            $Comment = Comment::findOrFail($id);
            return response()->json($Comment);
        } catch(ModelNotFoundException $e){
            return abort(500, 'Comment not found');
        }

    }

    public function update(CommentRequest $request)
    {
        $id = $request->id;
        try {
            $Comment = Comment::findOrFail($id);
            $Comment->update($request->validated());
            return response()->json([
                'status' => 'success'
            ]);
        }
        catch(ModelNotFoundException $e){
            return abort(500, 'Comment not found');
        }


    }

    public function destroy(Request $request)
    {
        $id = $request->query('id');
        try {
            $comments = Comment::findOrFail($id);

            $comments->delete();

            return response()->json([
                'status' => 'success',
            ]);
        } catch(ModelNotFoundException $e){
            return abort(500, 'Comment not found');
        }

    }
}
