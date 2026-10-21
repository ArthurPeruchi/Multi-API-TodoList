<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificarChaveIntegracao
{
    public function handle(Request $request, Closure $next): Response
    {
        $chaveConfigurada = config('services.log_service.key');
        $chaveRecebida = $request->header('X-Integration-Key');

        if (
            !is_string($chaveConfigurada) ||
            $chaveConfigurada === '' ||
            !is_string($chaveRecebida) ||
            !hash_equals($chaveConfigurada, $chaveRecebida)
        ) {
            return response()->json([
                'mensagem' => 'Acesso não autorizado ao serviço de logs.'
            ], 401);
        }

        return $next($request);
    }
}