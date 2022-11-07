<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::controller(AuthController::class)->group(function () {
    Route::get('/auth/login', 'login');
    Route::post('auth/register', 'register');
    Route::get('auth/logout', 'logout');
    Route::post('auth/refresh', 'refresh');
});

//More Laravel way would be to just include Route::apiResource('entities', commentController::class);
// this is done to include aliases to standard laravel path such as index -> to comment/list

Route::controller(CommentController::class)->group(function () {
    Route::get('comment/list','index');
    Route::post('comment/create', 'store');
    Route::get('comment/load', 'show');
    Route::post('comment/update', 'update');
    Route::get('comment/delete', 'destroy');
});
