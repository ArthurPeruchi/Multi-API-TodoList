const URL_SERVICO_LOGS = process.env.LOG_SERVICE_URL ?? "http://127.0.0.1:8000/api/logs";

const CHAVE_INTEGRACAO = process.env.LOG_SERVICE_KEY;

interface DadosLog {
    acao: string;
    detalhe?: string;
    usuario_id?: number;
}

export async function registrarLog(dados: DadosLog): Promise<void> {
    if (!CHAVE_INTEGRACAO) {
        console.error(
            "LOG_SERVICE_KEY não está configurada. Log não enviado."
        );
        return;
    }

    try {
        const resposta = await fetch(URL_SERVICO_LOGS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Integration-Key": CHAVE_INTEGRACAO,
            },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            console.error(
                `Falha ao registrar log. HTTP ${resposta.status}`
            );
        }
    } catch (erro) {
        console.error(
            "Não foi possível conectar ao serviço de logs:",
            erro
        );
    }
}