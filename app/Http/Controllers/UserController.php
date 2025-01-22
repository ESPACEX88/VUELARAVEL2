<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;



class UserController extends Controller
{
    public function index()
{
    $users = User::withTrashed()->get(); 
    return response()->json($users);
}


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        return response()->json(User::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255',
            'password' => 'string|min:6',
        ]);
    
        $user = User::findOrFail($id);
    
        // Actualizar solo los campos permitidos
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,  // Solo actualiza si hay un nuevo password
        ]);
    
        return response()->json($user);
    }
    

    public function destroy($id)
    {
        $user = User::find($id);
    
        if ($user) {
            $user->delete();  // Esto aplica el soft delete
            return response()->json(['message' => 'User deleted successfully']);
        }
    
        return response()->json(['message' => 'User not found'], 404);
    }
    


    public function getUsers()
{
    $this->authorize('view-users');

    $users = User::all();
    return response()->json($users, 200);
}

public function restore($id)
{
    $user = User::withTrashed()->find($id); 

    if ($user) {
        $user->restore();
        return response()->json(['message' => 'User restored successfully']);
    }

    return response()->json(['message' => 'User not found'], 404);
}

public function changePassword(Request $request)
{
    // Validar las contraseñas
    $request->validate([
        'current_password' => 'required|string|min:6',
        'new_password' => 'required|string|min:6|confirmed',
    ]);

    $user = $request->user(); // Obtener el usuario autenticado

    // Verificar si la contraseña actual es correcta
    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['message' => 'Contraseña actual incorrecta.'], 400);
    }

    // Actualizar la contraseña con la nueva
    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json(['message' => 'Contraseña cambiada exitosamente.']);
}



}