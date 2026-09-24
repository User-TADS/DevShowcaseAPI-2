import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const cyan = '\x1b[36m';
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const bold = '\x1b[1m';
  const gray = '\x1b[90m';
  const magenta = '\x1b[35m';
  const reset = '\x1b[0m';

  console.log(`
  ${green}${bold}======================================================${reset}
  ${green}${bold}🚀 DevShowcase API (Etapa Final) - Servidor Iniciado!${reset}
  ${green}${bold}======================================================${reset}
  ${bold}🌐 Base URL:${reset}       ${cyan}http://localhost:${PORT}${reset}
  ${bold}📖 Swagger UI:${reset}     ${cyan}http://localhost:${PORT}/docs${reset}
  ${bold}📋 Status da API:${reset}  ${cyan}http://localhost:${PORT}/api${reset}
  ${bold}🛠️  Ambiente:${reset}      ${yellow}${process.env.NODE_ENV || 'development'}${reset}
  ${gray}------------------------------------------------------${reset}
  ${bold}📌 Endpoints Principais (Etapa Final):${reset}

  ${gray}[Projetos & Upvotes & Feedbacks]${reset}
    ${green}GET${reset}    /api/projects                      ${gray}(Filtro por tecnologia e paginação)${reset}
    ${green}GET${reset}    /api/projects/:id                  ${gray}(Detalhes completos do projeto)${reset}
    ${yellow}POST${reset}   /api/projects                      ${gray}(Cadastrar projeto com Profile e Techs)${reset}
    ${magenta}PUT${reset}    /api/projects/:id/upvote           ${gray}(Incrementar curtidas/estrelas)${reset}
    ${yellow}POST${reset}   /api/projects/:id/feedbacks        ${gray}(Avaliação 1-5 + recálculo da nota média)${reset}

  ${gray}[Feedbacks Gerais]${reset}
    ${green}GET${reset}    /api/feedbacks/project/:projectId  ${gray}(Listar feedbacks do projeto)${reset}
    ${yellow}POST${reset}   /api/feedbacks                     ${gray}(Cadastrar feedback via body)${reset}

  ${gray}[Perfis (Profiles)]${reset}
    ${green}GET${reset}    /api/profiles                      ${gray}(Listar todos os perfis)${reset}
    ${green}GET${reset}    /api/profiles/:id                  ${gray}(Buscar perfil com projetos)${reset}
    ${yellow}POST${reset}   /api/profiles                      ${gray}(Cadastrar desenvolvedor)${reset}

  ${gray}[Tecnologias]${reset}
    ${green}GET${reset}    /api/technologies                  ${gray}(Listar tecnologias)${reset}
    ${yellow}POST${reset}   /api/technologies                  ${gray}(Cadastrar tecnologia)${reset}

  ${gray}[Manutenção]${reset}
    ${yellow}POST${reset}   /api/database/reset                ${gray}(Limpar/Zerar Banco de Dados)${reset}
  ${green}${bold}======================================================${reset}
  ${gray}Aguardando requisições... (logs de tráfego em tempo real abaixo)${reset}
  `);
});
