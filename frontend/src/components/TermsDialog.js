import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const TermsDialog = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-primary uppercase">
            Termos de Uso e Política de Privacidade
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4 text-sm text-slate-700 font-body leading-relaxed">
            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">1. COLETA E USO DE DADOS</h3>
              <p>
                Ao preencher o formulário de cadastro do Quiz PL Jovem, você concorda em fornecer seus dados pessoais 
                (nome completo, e-mail, telefone, endereço completo com número e CEP) para fins de:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Participação no evento e quiz do PL Jovem</li>
                <li>Registro de pontuação e resultados</li>
                <li>Comunicação institucional do PL Jovem</li>
                <li>Atualizações sobre mandato, atividades parlamentares e eventos políticos</li>
              </ul>
            </section>

            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">2. FINALIDADE DA COLETA</h3>
              <p>
                Os dados coletados serão utilizados exclusivamente para:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Construção e manutenção de base de contatos do PL Jovem</li>
                <li>Envio de newsletters, comunicados e atualizações sobre o mandato do vereador</li>
                <li>Convites para eventos, encontros e atividades do partido</li>
                <li>Pesquisas de opinião e engajamento cívico</li>
                <li>Comunicação sobre projetos de lei e ações parlamentares</li>
              </ul>
            </section>

            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">3. COMPARTILHAMENTO DE DADOS</h3>
              <p>
                Seus dados pessoais NÃO serão vendidos, alugados ou compartilhados com terceiros para fins comerciais. 
                Poderão ser compartilhados apenas com:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Estrutura oficial do Partido Liberal (PL)</li>
                <li>Equipe de gabinete do vereador</li>
                <li>Plataformas de e-mail marketing e comunicação (quando aplicável)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">4. DIREITOS DO TITULAR (VOCÊ)</h3>
              <p>
                Conforme a LGPD, você tem direito a:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Confirmar a existência de tratamento de seus dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                <li>Revogar o consentimento a qualquer momento</li>
                <li>Opor-se ao tratamento de dados em determinadas situações</li>
              </ul>
            </section>

            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">5. SEGURANÇA DOS DADOS</h3>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, 
                perda, destruição ou alteração. Os dados são armazenados em servidores seguros com criptografia.
              </p>
            </section>

            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">6. RETENÇÃO DE DADOS</h3>
              <p>
                Seus dados serão mantidos pelo período necessário para as finalidades descritas, ou conforme exigido por lei. 
                Você pode solicitar a exclusão de seus dados a qualquer momento através dos canais de contato.
              </p>
            </section>

            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">7. CONTATO DO ENCARREGADO (DPO)</h3>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus dados, entre em contato:
              </p>
              <ul className="list-none ml-0 mt-2 space-y-1">
                <li><strong>E-mail:</strong> privacidade@pljovem.org.br</li>
                <li><strong>Responsável:</strong> PL Jovem - Partido Liberal</li>
              </ul>
            </section>

            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">8. CONSENTIMENTO</h3>
              <p className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
                <strong>IMPORTANTE:</strong> Ao marcar a caixa de aceite e enviar este formulário, você declara ter lido, 
                compreendido e concordado com todos os termos desta Política de Privacidade, autorizando expressamente 
                o PL Jovem e o gabinete do vereador a utilizarem seus dados de contato (e-mail, telefone e endereço) 
                para envio de comunicações, newsletters, atualizações de mandato, convites para eventos e demais 
                atividades institucionais e políticas relacionadas ao partido.
              </p>
            </section>

            <section className="text-xs text-slate-500 italic mt-6 pt-4 border-t">
              <p>
                Última atualização: {new Date().toLocaleDateString('pt-BR')} | 
                Base legal: Art. 7º, I e Art. 11, II, alínea 'a' da Lei nº 13.709/2018 (LGPD)
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
