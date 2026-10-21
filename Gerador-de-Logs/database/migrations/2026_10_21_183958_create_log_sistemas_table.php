<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    
    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->string('acao', 100);
            $table->text('detalhe')->nullable();
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->timestamps();

            $table->index('usuario_id');
            $table->index('acao');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_sistemas');
    }
};
