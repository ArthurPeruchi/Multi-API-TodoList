<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogSistema extends Model
{
    protected $table = 'logs';

    protected $fillable = [
        'acao',
        'detalhe',
        'usuario_id',
    ];
}