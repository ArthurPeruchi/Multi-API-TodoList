<?php

namespace App\Http\Controllers;

use App\Models\LogSistema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'acao' => 'required|string|max:100',
            'detalhe' => 'nullable|string',
            'usuario_id' => 'nullable|integer|min:1',
        ]);

        $log = LogSistema::create($dados);

        return response()->json([
            'mensagem' => 'Log registrado com sucesso.',
            'log' => $log,
        ], 201);
    }
}