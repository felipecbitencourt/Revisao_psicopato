#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_content.py  (modelo v2)
=============================
Lê os markdowns em md/categorias/ e gera content.js — um único arquivo
JS que expõe `window.DSM_CONTENT` para a Plataforma DSM (index.html).

Usa .js (e não .json) porque o app roda como site estático aberto via
file://, onde fetch() de arquivos locais é bloqueado por CORS.

Estrutura gerada por transtorno:
  {
    n,                       # nome
    codes: [{dsm, cid, label}],   # 1+ variantes (severidade/subtipo)
    cid, dsm, code,          # primário (codes[0]) p/ chip da lista
    criteriaIntro,           # prosa antes do critério "A." (se houver)
    criteria: [{letter, text}],
    specifier,               # bloco "Especificar se / a gravidade"
    sections: [{title, body:[paragrafos]}],   # seções narrativas do DSM
    summary,                 # 1º parágrafo (p/ cards e flashcards)
  }

Uso:  python build_content.py
"""

import json
import os
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # build/ -> raiz do repo
# entrada/saída configuráveis (p/ staging TR sem tocar no build padrão)
CAT_DIR = os.environ.get("DSM_CAT_DIR", os.path.join(ROOT, "md", "categorias"))
OUT = os.environ.get("DSM_OUT", os.path.join(ROOT, "content.js"))
# resumos curados (linha autoral "tldr" + fatos-chave), gerados/revisados à parte.
# Chaveado por "<pasta>::<arquivo-sem-.md>"; ver build/tldr_facts.json.
TLDR_FACTS = os.environ.get("DSM_TLDR", os.path.join(ROOT, "build", "tldr_facts.json"))

# (cor, nome curto exibido na grade, progresso ilustrativo) — 20 categorias.
CAT_META = [
    ("#6C5CE7", "Transtornos do neurodesenvolvimento", 0.70),
    ("#00A6C7", "Espectro da esquizofrenia e psicóticos", 0.40),
    ("#F4A261", "Transtorno bipolar e relacionados", 0.55),
    ("#4361EE", "Transtornos depressivos", 0.60),
    ("#2A9D8F", "Transtornos de ansiedade", 0.85),
    ("#E76F51", "TOC e transtornos relacionados", 0.30),
    ("#9B5DE5", "Trauma e estressores", 0.50),
    ("#00BBF9", "Transtornos dissociativos", 0.20),
    ("#F15BB5", "Sintomas somáticos e relacionados", 0.35),
    ("#06D6A0", "Transtornos alimentares", 0.65),
    ("#118AB2", "Transtornos da eliminação", 0.10),
    ("#3A86FF", "Transtornos do sono-vigília", 0.25),
    ("#EF476F", "Disfunções sexuais", 0.15),
    ("#8338EC", "Disforia de gênero", 0.40),
    ("#FB5607", "Disruptivos, controle de impulsos e conduta", 0.45),
    ("#D6336C", "Substâncias e transtornos aditivos", 0.50),
    ("#588157", "Transtornos neurocognitivos", 0.30),
    ("#BC6C25", "Transtornos da personalidade", 0.60),
    ("#7209B7", "Transtornos parafílicos", 0.05),
    ("#5C6B73", "Outros transtornos mentais", 0.00),
]

# Seções narrativas reconhecidas (chave normalizada -> título de exibição).
# A ordem aqui não importa; o documento define a ordem final.
SECTION_MAP = [
    ("criterios diagnosticos", None),  # tratada à parte
    ("subtipos", "Subtipos"),
    ("especificadores", "Especificadores"),
    ("caracteristicas diagnosticas", "Características diagnósticas"),
    ("caracteristicas associadas", "Características associadas"),
    ("procedimentos para registro", "Procedimentos para registro"),
    ("marcadores diagnosticos", "Marcadores diagnósticos"),
    ("prevalencia", "Prevalência"),
    ("desenvolvimento e curso", "Desenvolvimento e curso"),
    ("fatores de risco e prognostico", "Fatores de risco e prognóstico"),
    ("questoes diagnosticas relativas a cultura", "Questões diagnósticas relativas à cultura"),
    ("questoes diagnosticas relacionadas a cultura", "Questões diagnósticas relativas à cultura"),
    ("questoes diagnosticas relativas ao sexo e ao genero", "Questões diagnósticas relativas ao sexo e ao gênero"),
    ("questoes diagnosticas relacionadas ao sexo e ao genero", "Questões diagnósticas relativas ao sexo e ao gênero"),
    ("questoes diagnosticas relativas ao genero", "Questões diagnósticas relativas ao gênero"),
    ("questoes diagnosticas relacionadas ao genero", "Questões diagnósticas relativas ao gênero"),
    ("risco de suicidio", "Risco de suicídio"),
    ("associacao com pensamentos ou comportamentos suicidas", "Associação com pensamentos ou comportamentos suicidas"),
    ("consequencias funcionais", "Consequências funcionais"),
    ("diagnostico diferencial", "Diagnóstico diferencial"),
    ("comorbidade", "Comorbidade"),
    ("relacao com outras classificacoes", "Relação com outras classificações"),
]

# Tabelas reconstruídas como dados estruturados (no lugar da imagem recortada).
#   cols: cabeçalhos; rows: cada linha = [rótulo, célula, célula, ...] onde a
#   célula é uma string OU uma lista de parágrafos. Texto conferido na fonte.
TABLES = {
    "deficiencia-gravidade": {
        "cols": ["Nível", "Domínio conceitual", "Domínio social", "Domínio prático"],
        "rows": [
            ["Leve",
             ["Em crianças pré-escolares, pode não haver diferenças conceituais óbvias. Para crianças em idade escolar e adultos, existem dificuldades em aprender habilidades acadêmicas que envolvam leitura, escrita, matemática, tempo ou dinheiro, sendo necessário apoio em uma ou mais áreas para o alcance das expectativas associadas à idade. Nos adultos, pensamento abstrato, função executiva (i.e., planejamento, estabelecimento de estratégias, fixação de prioridades e flexibilidade cognitiva) e memória de curto prazo, bem como uso funcional de habilidades acadêmicas (p. ex., leitura, controle do dinheiro), estão prejudicados. Há uma abordagem um tanto concreta a problemas e soluções em comparação com indivíduos na mesma faixa etária."],
             ["Comparado aos indivíduos na mesma faixa etária com desenvolvimento típico, o indivíduo mostra-se imaturo nas relações sociais. Por exemplo, pode haver dificuldade em perceber, com precisão, pistas sociais dos pares. Comunicação, conversação e linguagem são mais concretas e imaturas do que o esperado para a idade.",
              "Podem existir dificuldades de regulação da emoção e do comportamento de uma forma adequada à idade; tais dificuldades são percebidas pelos pares em situações sociais. Há compreensão limitada do risco em situações sociais; o julgamento social é imaturo para a idade, e a pessoa corre o risco de ser manipulada pelos outros (credulidade)."],
             ["O indivíduo pode funcionar de acordo com a idade nos cuidados pessoais. Precisa de algum apoio nas tarefas complexas da vida diária na comparação com os pares. Na vida adulta, os apoios costumam envolver compras de itens para a casa, transporte, organização do lar e dos cuidados com os filhos, preparo de alimentos nutritivos, atividades bancárias e controle do dinheiro.",
              "As habilidades recreativas assemelham-se às dos companheiros de faixa etária, embora o juízo relativo ao bem-estar e à organização da recreação precise de apoio. Na vida adulta, pode conseguir emprego em funções que não enfatizem habilidades conceituais. Os indivíduos em geral necessitam de apoio para tomar decisões de cuidados de saúde e decisões legais, bem como para aprender a desempenhar uma profissão de forma competente. Apoio costuma ser necessário para criar uma família."]],
            ["Moderada",
             ["Durante todo o desenvolvimento, as habilidades conceituais individuais ficam bastante atrás das dos companheiros.",
              "Nos pré-escolares, a linguagem e as habilidades pré-acadêmicas desenvolvem-se lentamente. Nas crianças em idade escolar, ocorre lento progresso na leitura, na escrita, na matemática e na compreensão do tempo e do dinheiro ao longo dos anos escolares, com limitações marcadas na comparação com os colegas. Nos adultos, o desenvolvimento de habilidades acadêmicas costuma mostrar-se em um nível elementar, havendo necessidade de apoio para todo emprego de habilidades acadêmicas no trabalho e na vida pessoal.",
              "Assistência contínua diária é necessária para a realização de tarefas conceituais cotidianas, sendo que outras pessoas podem assumir integralmente essas responsabilidades pelo indivíduo."],
             ["O indivíduo mostra diferenças marcadas em relação aos pares no comportamento social e na comunicação durante o desenvolvimento. A linguagem falada costuma ser um recurso primário para a comunicação social, embora com muito menos complexidade que a dos companheiros. A capacidade de relacionamento é evidente nos laços com família e amigos, e o indivíduo pode manter amizades bem-sucedidas na vida e, por vezes, relacionamentos românticos na vida adulta. Pode, entretanto, não perceber ou interpretar com exatidão as pistas sociais. O julgamento social e a capacidade de tomar decisões são limitados, com cuidadores tendo que auxiliar a pessoa nas decisões. Amizades com companheiros com desenvolvimento normal costumam ficar afetadas pelas limitações de comunicação e sociais. Há necessidade de apoio social e de comunicação significativo para o sucesso nos locais de trabalho."],
             ["O indivíduo é capaz de dar conta das necessidades pessoais envolvendo alimentar-se, vestir-se, eliminações e higiene como adulto, ainda que haja necessidade de período prolongado de ensino e de tempo para que se torne independente nessas áreas, talvez com necessidade de lembretes. Da mesma forma, participação em todas as tarefas domésticas pode ser alcançada na vida adulta, ainda que seja necessário longo período de aprendizagem, que um apoio continuado tenha que ocorrer para um desempenho adulto. Emprego independente em tarefas que necessitem de habilidades conceituais e comunicacionais limitadas pode ser conseguido, embora com necessidade de apoio considerável de colegas, supervisores e outras pessoas para o manejo das expectativas sociais, complexidades de trabalho e responsabilidades auxiliares, como horário, transportes, benefícios de saúde e controle do dinheiro. Uma variedade de habilidades recreacionais pode ser desenvolvida. Estas costumam demandar apoio e oportunidades de aprendizagem por um longo período de tempo. Comportamento mal-adaptativo está presente em uma minoria significativa, causando problemas sociais."]],
            ["Grave",
             ["Alcance limitado de habilidades conceituais. Geralmente, o indivíduo tem pouca compreensão da linguagem escrita ou de conceitos que envolvam números, quantidade, tempo e dinheiro. Os cuidadores proporcionam grande apoio para a solução de problemas ao longo da vida."],
             ["A linguagem falada é bastante limitada em termos de vocabulário e gramática. A fala pode ser composta de palavras ou expressões isoladas, com possível suplementação por meios alternativos. A fala e a comunicação têm foco no aqui e agora dos eventos diários. A linguagem é usada para comunicação social mais do que para explicações. Os indivíduos entendem discursos e comunicação gestual simples. As relações com familiares e pessoas conhecidas constituem fonte de prazer e ajuda."],
             ["O indivíduo necessita de apoio para todas as atividades cotidianas, inclusive refeições, vestir-se, banhar-se e eliminação. Precisa de supervisão em todos os momentos. Não é capaz de tomar decisões responsáveis quanto a seu bem-estar e dos demais. Na vida adulta, há necessidade de apoio e assistência contínuos nas tarefas domésticas, recreativas e profissionais. A aquisição de habilidades em todos os domínios envolve ensino prolongado e apoio contínuo. Comportamento mal-adaptativo, inclusive autolesão, está presente em uma minoria significativa."]],
            ["Profunda",
             ["As habilidades conceituais costumam envolver mais o mundo físico do que os processos simbólicos. A pessoa pode usar objetos de maneira direcionada a metas para o autocuidado, o trabalho e a recreação. Algumas habilidades visuoespaciais, como combinar e classificar, baseadas em características físicas, podem ser adquiridas. A ocorrência concomitante de prejuízos motores e sensoriais, porém, pode impedir o uso funcional dos objetos."],
             ["O indivíduo apresenta compreensão muito limitada da comunicação simbólica na fala ou nos gestos. Pode entender algumas instruções ou gestos simples. Há ampla expressão dos próprios desejos e emoções pela comunicação não verbal e não simbólica. A pessoa aprecia os relacionamentos com membros bem conhecidos da família, cuidadores e outras pessoas conhecidas, além de iniciar interações sociais e reagir a elas por meio de pistas gestuais e emocionais. A ocorrência concomitante de prejuízos sensoriais e físicos pode impedir muitas atividades sociais."],
             ["O indivíduo depende de outros para todos os aspectos do cuidado físico diário, saúde e segurança, ainda que possa conseguir participar também de algumas dessas atividades. Aqueles sem prejuízos físicos graves podem ajudar em algumas tarefas diárias de casa, como levar os pratos para a mesa.",
              "Ações simples com objetos podem constituir a base para a participação em algumas atividades profissionais com níveis elevados de apoio continuado. Atividades recreativas podem envolver, por exemplo, apreciar ouvir música, assistir a filmes, sair para passear ou participar de atividades aquáticas, tudo isso com apoio de outras pessoas.",
              "A ocorrência concomitante de prejuízos físicos e sensoriais é barreira frequente à participação (além da observação) em atividades domésticas, recreativas e profissionais. Comportamento mal-adaptativo está presente em uma minoria significativa."]],
        ],
    },
    "autismo-gravidade": {
        "cols": ["Nível", "Comunicação social", "Comportamentos restritos e repetitivos"],
        "rows": [
            ["Nível 3 — Exigindo apoio muito substancial",
             ["Déficits graves nas habilidades de comunicação social verbal e não verbal causam prejuízos graves de funcionamento, grande limitação em dar início a interações sociais e resposta mínima a aberturas sociais que partem de outros. Por exemplo, uma pessoa com fala inteligível de poucas palavras que raramente inicia as interações e, quando o faz, tem abordagens incomuns apenas para satisfazer a necessidades e reage somente a abordagens sociais muito diretas."],
             ["Inflexibilidade de comportamento, extrema dificuldade em lidar com a mudança ou outros comportamentos restritos/repetitivos interferem acentuadamente no funcionamento em todas as esferas. Grande sofrimento/dificuldade para mudar o foco ou as ações."]],
            ["Nível 2 — Exigindo apoio substancial",
             ["Déficits graves nas habilidades de comunicação social verbal e não verbal; prejuízos sociais aparentes mesmo na presença de apoio; limitação em dar início a interações sociais e resposta reduzida ou anormal a aberturas sociais que partem de outros. Por exemplo, uma pessoa que fala frases simples, cuja interação se limita a interesses especiais reduzidos e que apresenta comunicação não verbal acentuadamente estranha."],
             ["Inflexibilidade do comportamento, dificuldade de lidar com a mudança ou outros comportamentos restritos/repetitivos aparecem com frequência suficiente para serem óbvios ao observador casual e interferem no funcionamento em uma variedade de contextos. Sofrimento e/ou dificuldade de mudar o foco ou as ações."]],
            ["Nível 1 — Exigindo apoio",
             ["Na ausência de apoio, déficits na comunicação social causam prejuízos notáveis. Dificuldade para iniciar interações sociais e exemplos claros de respostas atípicas ou sem sucesso a aberturas sociais dos outros. Pode parecer apresentar interesse reduzido por interações sociais. Por exemplo, uma pessoa que consegue falar frases completas e envolver-se na comunicação, embora apresente falhas na conversação com os outros e cujas tentativas de fazer amizades são estranhas e comumente malsucedidas."],
             ["Inflexibilidade de comportamento causa interferência significativa no funcionamento em um ou mais contextos. Dificuldade em trocar de atividade. Problemas para organização e planejamento são obstáculos à independência."]],
        ],
    },
    "lct-gravidade": {
        "cols": ["Característica da lesão", "LCT leve", "LCT moderada", "LCT grave"],
        "rows": [
            ["Perda de consciência", "< 30 min", "30 min–24 horas", "> 24 horas"],
            ["Amnésia pós-traumática", "< 24 horas", "24 horas–7 dias", "> 7 dias"],
            ["Desorientação e confusão na primeira avaliação (Escala de Coma de Glasgow)", "13–15 (não abaixo de 13 a 30 minutos)", "9–12", "3–8"],
        ],
    },
    # matriz densa (abreviações). Reconstruída do md + imagem; conferir contra a fonte.
    "substancias-diagnosticos": {
        "matrix": True,
        "cols": ["Classe", "Psicóticos", "Bipolares", "Depressivos", "Ansiedade", "TOC", "Sono",
                 "Disf. sexuais", "Delirium", "Neurocognitivos", "Uso", "Intoxicação", "Abstinência"],
        "rows": [
            ["Álcool", "I/A", "I/A", "I/A", "I/A", "", "I/A", "I/A", "I/A", "I/A/P", "X", "X", "X"],
            ["Cafeína", "", "", "", "I", "", "I/A", "", "", "", "", "X", "X"],
            ["Cannabis", "I", "", "", "I", "", "I/A", "", "I", "", "X", "X", "X"],
            ["Fenciclidina", "I", "I", "I", "I", "", "", "", "I", "", "X", "X", ""],
            ["Outros alucinógenos", "I*", "I", "I", "I", "", "", "", "I", "", "X", "X", ""],
            ["Inalantes", "I", "", "I", "I", "", "", "", "I", "I/P", "X", "X", ""],
            ["Opioides", "", "", "I/A", "A", "", "I/A", "I/A", "I/A", "", "X", "X", "X"],
            ["Sedativos, hipnóticos ou ansiolíticos", "I/A", "I/A", "I/A", "A", "", "I/A", "I/A", "I/A", "I/A/P", "X", "X", "X"],
            ["Estimulantes", "I", "I/A", "I/A", "I/A", "I/A", "I/A", "I", "I", "", "X", "X", "X"],
            ["Tabaco", "", "", "", "", "", "A", "", "", "", "X", "", "X"],
            ["Outra substância (ou desconhecida)", "I/A", "I/A", "I/A", "I/A", "I/A", "I/A", "I/A", "I/A", "I/A/P", "X", "X", "X"],
        ],
    },
}

# Tabelas do DSM que foram achatadas na extração e que substituímos por
# imagem recortada do PDF. Chave: nome do transtorno -> título da seção.
#   keep_first: nº de parágrafos iniciais a manter (ex.: a frase introdutória)
#   images: lista de caminhos; caption: legenda/fonte.
#   keep_first: mantém N parágrafos iniciais e anexa a imagem ao fim
#   drop: lista de intervalos [ini, fim) de parágrafos a remover (tabela
#         achatada no meio da seção); o restante é mantido + imagem ao fim
# DSM-5-TR: as tabelas de gravidade são visuais no PDF (não extraem como texto),
# então aqui apenas ANEXAMOS a tabela reconstruída à seção (append). Chaves =
# nomes TR dos transtornos.
SECTION_ASSETS = {
    "Transtorno do Desenvolvimento Intelectual (Deficiência Intelectual)": {
        "Especificadores": {
            "append": True,
            "table": "deficiencia-gravidade",
            "caption": "DSM-5-TR — Tabela 1: Níveis de gravidade da deficiência intelectual (domínios conceitual, social e prático).",
        },
        # "Características diagnósticas" absorveu a Tabela 1 achatada (par. 4+);
        # mantém os 4 parágrafos de texto real (tabela limpa fica em Especificadores).
        "Características diagnósticas": {
            "keep_first": 4,
        },
    },
    "Transtorno do Espectro Autista": {
        "Especificadores": {
            "append": True,
            "table": "autismo-gravidade",
            "caption": "DSM-5-TR — Tabela 2: Níveis de gravidade do transtorno do espectro autista (comunicação social; comportamentos restritos e repetitivos).",
        },
        # "Procedimentos para registro" absorveu a Tabela 2 achatada/embaralhada;
        # mantém só os 4 parágrafos de texto real (a tabela limpa fica em Especificadores).
        "Procedimentos para registro": {
            "keep_first": 4,
        },
    },
    "Transtorno Neurocognitivo Maior ou Leve Devido a Lesão Cerebral Traumática": {
        # a TABELA 2 (gravidade da LCT) aparece achatada no MEIO de "Características
        # diagnósticas" (par. 3–23), com texto real antes e depois → drop + tabela limpa.
        "Características diagnósticas": {
            "drop": [[3, 24]],
            "table": "lct-gravidade",
            "caption": "DSM-5-TR — Tabela 2: Classificações da gravidade de lesão cerebral traumática (LCT).",
        }
    },
}

# Tabelas de "nível-capítulo" (não pertencem a um transtorno só): adicionadas
# como uma seção nova (só imagem) a um transtorno representativo.
ADD_SECTIONS = {
    "Transtorno Neurocognitivo Maior ou Leve Devido à Doença de Alzheimer": [
        {
            "title": "Domínios neurocognitivos",
            "images": [
                "assets/tabelas/neurocognitivo/dominios-1.png",
                "assets/tabelas/neurocognitivo/dominios-2.png",
                "assets/tabelas/neurocognitivo/dominios-3.png",
            ],
            "caption": "DSM-5-TR — Tabela 1: Domínios neurocognitivos (sintomas/observações e exemplos de avaliação). Referência do capítulo.",
        }
    ],
    "Transtorno por Uso de Álcool": [
        {
            "title": "Diagnósticos por classe de substância",
            "table": "substancias-diagnosticos",
            "caption": "DSM-5-TR — Tabela 1: Diagnósticos associados a classes de substâncias. Legenda: I = início durante a intoxicação · A = início durante a abstinência · I/A = intoxicação e/ou abstinência · P = transtorno persistente · X = categoria reconhecida no DSM-5. * Também transtorno persistente da percepção induzido por alucinógenos (flashbacks). ** Inclui cocaína e substâncias tipo anfetamina.",
        }
    ],
}

# Códigos fixos que o parser não captura (o código vem num heading ACIMA do
# título, é compartilhado entre subtipos, ou o transtorno aparece como
# referência cruzada noutro capítulo sem o próprio heading de código).
# Todos conferidos contra o DSM-5-TR / fonte. Chave = nome do transtorno.
#   {"dsm","cid"} preenche o código primário; "codes" (opcional) define a
#   lista completa de variantes (CID por subtipo).
CODE_OVERRIDES = {
    "Transtorno (da Personalidade) Esquizotípica": {"dsm": "301.22", "cid": "F21"},
    "Transtorno de estresse pós-traumático": {"dsm": "309.81", "cid": "F43.10"},
    "Transtorno de estresse pós-traumático em crianças de 6 anos ou menos": {"dsm": "309.81", "cid": "F43.10"},
    "Transtorno da Personalidade Antissocial": {"dsm": "301.7", "cid": "F60.2"},
    "Transtorno do Tipo Sono-Vigília Não de 24 Horas": {"dsm": "307.45", "cid": "G47.24"},
    # DSM 293.83 é fixo (independe do especificador); a CID-10 varia por especificador.
    "Transtorno Bipolar e Transtorno Relacionado Devido a Outra Condição Médica": {"dsm": "293.83", "cid": ""},
    "Pica": {"dsm": "307.52", "cid": "F98.3", "codes": [
        {"dsm": "307.52", "cid": "F98.3", "label": "Em crianças"},
        {"dsm": "307.52", "cid": "F50.8", "label": "Em adultos"},
    ]},
    "Anorexia Nervosa": {"dsm": "307.1", "cid": "F50.01", "codes": [
        {"dsm": "307.1", "cid": "F50.01", "label": "Tipo restritivo"},
        {"dsm": "307.1", "cid": "F50.02", "label": "Tipo compulsão alimentar purgativa"},
    ]},
    # DSM 300.11 é fixo (independe do sintoma); a CID-10 varia por tipo de sintoma.
    "Transtorno Conversivo (Transtorno de Sintomas Neurológicos Funcionais)": {"dsm": "300.11", "cid": "F44.4", "codes": [
        {"dsm": "300.11", "cid": "F44.4", "label": "Com fraqueza/paralisia, movimento anormal, sintomas de deglutição ou de fala"},
        {"dsm": "300.11", "cid": "F44.5", "label": "Com ataques ou convulsões"},
        {"dsm": "300.11", "cid": "F44.6", "label": "Com anestesia/perda sensorial ou sintoma sensorial especial"},
        {"dsm": "300.11", "cid": "F44.7", "label": "Com sintomas mistos"},
    ]},
    "Transtorno Factício Autoimposto": {"dsm": "300.19", "cid": "F68.10"},
    # DSM-5-TR: "imposto a outro" passou a usar a CID-10-MC F68.A (vigente desde out/2022).
    "Transtorno Factício Imposto a Outro (Antes Transtorno Factício por Procuração)": {"dsm": "300.19", "cid": "F68.A"},
    # --- Tiques: o heading de código (#### 307.xx (F95.x)) ficou no README da
    # categoria, não no arquivo por transtorno; recuperado aqui (fonte: README). ---
    "Transtorno de Tourette": {"dsm": "307.23", "cid": "F95.2"},
    "Transtorno de Tique Motor ou Vocal Persistente (Crônico)": {"dsm": "307.22", "cid": "F95.1"},
    "Transtorno de Tique Transitório": {"dsm": "307.21", "cid": "F95.0"},
    # Deficiência intelectual: código por nível de gravidade (heading com 4 códigos inline).
    "Transtorno do Desenvolvimento Intelectual (Deficiência Intelectual)": {"dsm": "317", "cid": "F70", "codes": [
        {"dsm": "317",   "cid": "F70", "label": "Leve"},
        {"dsm": "318.0", "cid": "F71", "label": "Moderada"},
        {"dsm": "318.1", "cid": "F72", "label": "Grave"},
        {"dsm": "318.2", "cid": "F73", "label": "Profunda"},
    ]},
    # Despertar do sono não REM: código por subtipo (estava num especificador achatado).
    "Transtornos de Despertar do Sono Não REM": {"dsm": "307.46", "cid": "F51.3", "codes": [
        {"dsm": "307.46", "cid": "F51.3", "label": "Tipo sonambulismo"},
        {"dsm": "307.46", "cid": "F51.4", "label": "Tipo terror noturno"},
    ]},
    # DSM-5-TR: depressivo não especificado usa F32.A (F32.9 ficou p/ EDM episódio único).
    "Transtorno Depressivo Não Especificado": {"dsm": "311", "cid": "F32.A"},
    # Depressivo maior: matriz por episódio (único/recorrente) × gravidade (fonte: README).
    "Transtorno Depressivo Maior": {"dsm": "296.20", "cid": "F32.9", "codes": [
        {"dsm": "296.21", "cid": "F32.0",  "label": "Episódio único — leve"},
        {"dsm": "296.22", "cid": "F32.1",  "label": "Episódio único — moderado"},
        {"dsm": "296.23", "cid": "F32.2",  "label": "Episódio único — grave"},
        {"dsm": "296.24", "cid": "F32.3",  "label": "Episódio único — com características psicóticas"},
        {"dsm": "296.25", "cid": "F32.4",  "label": "Episódio único — em remissão parcial"},
        {"dsm": "296.26", "cid": "F32.5",  "label": "Episódio único — em remissão completa"},
        {"dsm": "296.20", "cid": "F32.9",  "label": "Episódio único — não especificado"},
        {"dsm": "296.31", "cid": "F33.0",  "label": "Recorrente — leve"},
        {"dsm": "296.32", "cid": "F33.1",  "label": "Recorrente — moderado"},
        {"dsm": "296.33", "cid": "F33.2",  "label": "Recorrente — grave"},
        {"dsm": "296.34", "cid": "F33.3",  "label": "Recorrente — com características psicóticas"},
        {"dsm": "296.35", "cid": "F33.41", "label": "Recorrente — em remissão parcial"},
        {"dsm": "296.36", "cid": "F33.42", "label": "Recorrente — em remissão completa"},
        {"dsm": "296.30", "cid": "F33.9",  "label": "Recorrente — não especificado"},
    ]},
    # Bipolar tipo I: código por episódio atual × gravidade (fonte: README).
    "Transtorno Bipolar Tipo I": {"dsm": "296.41", "cid": "F31.11", "codes": [
        {"dsm": "296.41", "cid": "F31.11", "label": "Episódio atual maníaco — leve"},
        {"dsm": "296.42", "cid": "F31.12", "label": "Episódio atual maníaco — moderado"},
        {"dsm": "296.43", "cid": "F31.13", "label": "Episódio atual maníaco — grave"},
        {"dsm": "296.44", "cid": "F31.2",  "label": "Episódio atual maníaco — com características psicóticas"},
        {"dsm": "296.51", "cid": "F31.31", "label": "Episódio atual depressivo — leve"},
        {"dsm": "296.52", "cid": "F31.32", "label": "Episódio atual depressivo — moderado"},
        {"dsm": "296.53", "cid": "F31.4",  "label": "Episódio atual depressivo — grave"},
        {"dsm": "296.54", "cid": "F31.5",  "label": "Episódio atual depressivo — com características psicóticas"},
        {"dsm": "296.45", "cid": "F31.0",  "label": "Episódio atual hipomaníaco"},
        {"dsm": "296.40", "cid": "F31.9",  "label": "Não especificado"},
    ]},
}

# Correções de TEXTO de erros presentes na própria camada de texto do PDF
# (não recuperáveis por reprocessamento). Substituição exata, aplicada aos
# critérios. Chave = trecho errado -> trecho correto.
TEXT_FIXES = {
    # Esquizofrenia, Critério E: negação invertida (critério de EXCLUSÃO).
    "A perturbação pode ser atribuída aos efeitos fisiológicos de uma substância (p. ex., droga de abuso, medicamento) ou a outra condição médica.":
        "A perturbação não é atribuível aos efeitos fisiológicos de uma substância (p. ex., droga de abuso, medicamento) ou a outra condição médica.",
}


# Referências cruzadas que o PDF truncou no FIM do critério (perdeu a letra do
# Critério referido). Restauradas com âncora de fim-de-texto p/ não duplicar
# ocorrências completas. (regex, repl)
DANGLING_REFS = [
    (re.compile(r"(produzir os sintomas (?:do|no) Critério)\s*$"), r"\1 A."),
    (re.compile(r"(produzir os sintomas mencionados no Critério)\s*$"), r"\1 A."),
    (re.compile(r"(sintomas dos Critérios A)-\s*$"), r"\1-D."),
    # rótulo de especificador que vazou inline para o FIM do critério ("…vida do
    # indivíduo. Especificar se:") — instrução, não diagnóstico; o specifier
    # real é renderizado à parte. Remove o rótulo órfão.
    (re.compile(r"\s*(?:Especificar|Determinar)\b[^.:]*:\s*$"), ""),
]


def apply_text_fixes(text):
    for wrong, right in TEXT_FIXES.items():
        if wrong in text:
            text = text.replace(wrong, right)
    for pat, repl in DANGLING_REFS:
        text = pat.sub(repl, text)
    return text


# Especificadores reconstruídos para casos em que o PDF achatou uma TABELA
# (subtipo/gravidade x código) num único campo, perdendo ou embaralhando
# itens. Chave = nome do transtorno -> lista de blocos {head, items:[{label,desc}]}.
# Conteúdo conferido contra a fonte (md/categorias/...).
SPECIFIER_OVERRIDES = {
    "Transtorno Específico da Aprendizagem": [
        {"head": "Especificar se", "items": [
            {"label": "315.00 (F81.0) Com prejuízo na leitura", "desc": "Precisão na leitura de palavras; velocidade ou fluência da leitura; compreensão da leitura (dislexia é um termo alternativo)."},
            {"label": "315.2 (F81.81) Com prejuízo na expressão escrita", "desc": "Precisão na ortografia; precisão na gramática e na pontuação; clareza ou organização da expressão escrita."},
            {"label": "315.1 (F81.2) Com prejuízo na matemática", "desc": "Senso numérico; memorização de fatos aritméticos; precisão ou fluência de cálculo; precisão no raciocínio matemático (discalculia é um termo alternativo)."},
        ]},
        {"head": "Especificar a gravidade atual", "items": [
            {"label": "Leve", "desc": "Alguma dificuldade em um ou dois domínios acadêmicos, leve o bastante para o indivíduo compensar com adaptações ou apoio adequados, especialmente durante os anos escolares."},
            {"label": "Moderada", "desc": "Dificuldades acentuadas em um ou mais domínios; improvável tornar-se proficiente sem períodos de ensino intensivo e especializado durante os anos escolares."},
            {"label": "Grave", "desc": "Dificuldades graves afetando vários domínios; improvável aprender sem ensino individualizado e especializado continuado; mesmo com apoio, pode não completar as atividades com eficiência."},
        ]},
    ],
    "Transtorno por Uso de Estimulantes": [
        {"head": "Especificar se", "items": [
            {"label": "Em remissão inicial", "desc": "Após todos os critérios terem sido preenchidos antes, nenhum deles foi preenchido por um período mínimo de 3 meses, porém inferior a 12 meses (exceto o Critério A4, fissura, que pode ocorrer)."},
            {"label": "Em remissão sustentada", "desc": "Após todos os critérios terem sido preenchidos antes, nenhum deles foi preenchido em momento algum durante um período igual ou superior a 12 meses (exceto o Critério A4, fissura)."},
            {"label": "Em ambiente protegido", "desc": "Especificador adicional usado quando o indivíduo está em um ambiente no qual o acesso a estimulantes é restrito (ex.: prisões vigiadas, comunidades terapêuticas, unidades hospitalares fechadas)."},
        ]},
        {"head": "Especificar a gravidade atual", "items": [
            {"label": "Leve", "desc": "Presença de 2 ou 3 sintomas. CID-10: F15.10 (anfetamina/outro estimulante), F14.10 (cocaína)."},
            {"label": "Moderada", "desc": "Presença de 4 ou 5 sintomas. CID-10: F15.20 (anfetamina/outro estimulante), F14.20 (cocaína)."},
            {"label": "Grave", "desc": "Presença de 6 ou mais sintomas. CID-10: F15.20 (anfetamina/outro estimulante), F14.20 (cocaína)."},
        ]},
    ],
}


# Subgrupos da "Classificação do DSM-5" dentro de cada categoria.
# índice da categoria -> lista ordenada de (nome do subgrupo, nível, [palavras-
# chave]). Cada transtorno é atribuído ao 1º grupo cuja palavra-chave aparece no
# nome (independente da ordem do README, que é alfabética); depois os itens são
# REORDENADOS para a ordem dos grupos (e, dentro do grupo, pela ordem da
# palavra-chave). nível 2 = subgrupo aninhado; nome "" = sem cabeçalho (item de
# nível superior, fora de qualquer subgrupo). Antes era um modelo "sticky" que
# assumia ordem de documento e agrupava errado quando o README era alfabético.
SUBGROUPS = {
    0: [  # Transtornos do Neurodesenvolvimento
        ("Deficiências Intelectuais", 1, ["Desenvolvimento Intelectual", "Atraso Global"]),
        ("Transtornos da Comunicação", 1, ["Linguagem", "da Fala", "Fluência", "Comunicação"]),
        ("Transtorno do Espectro Autista", 1, ["Espectro Autista"]),
        ("Transtorno de Déficit de Atenção/Hiperatividade", 1, ["Déficit de Atenção"]),
        ("Transtorno Específico da Aprendizagem", 1, ["Aprendizagem"]),
        ("Transtornos Motores", 1, ["Coordenação", "Movimento Estereotipado"]),
        ("Transtornos de Tique", 2, ["Tique", "Tourette"]),
        ("Outros Transtornos do Neurodesenvolvimento", 1, ["Neurodesenvolvimento"]),
    ],
    11: [  # Transtornos do Sono-Vigília (nome "" = transtorno de nível superior)
        ("", 0, ["Insônia"]),
        ("", 0, ["Hipersonolência"]),
        ("", 0, ["Narcolepsia"]),
        ("Transtornos do Sono Relacionados à Respiração", 1, ["Apneia", "Hipoventilação"]),
        ("", 0, ["Ritmo Circadiano"]),
        ("Parassonias", 1, ["Despertar", "Pesadelo", "Comportamental do Sono REM", "Pernas Inquietas"]),
        ("", 0, ["Induzido por Substância"]),
        ("", 0, ["Sono-Vigília Especificado"]),
    ],
    15: [  # Substâncias e transtornos aditivos (por classe de substância)
        ("Transtornos Relacionados ao Álcool", 1, ["Álcool"]),
        ("Transtornos Relacionados à Cafeína", 1, ["Cafeína"]),
        ("Transtornos Relacionados à Cannabis", 1, ["Cannabis"]),
        ("Transtornos Relacionados aos Alucinógenos", 1, ["Fenciclidina", "Alucinógenos"]),
        ("Transtornos Relacionados aos Inalantes", 1, ["Inalantes"]),
        ("Transtornos Relacionados aos Opioides", 1, ["Opioides"]),
        ("Transtornos Relacionados aos Sedativos, Hipnóticos ou Ansiolíticos", 1, ["Sedativos"]),
        ("Transtornos Relacionados aos Estimulantes", 1, ["Estimulantes"]),
        ("Transtornos Relacionados ao Tabaco", 1, ["Tabaco"]),
        ("Transtornos Relacionados a Outras Substâncias (ou Desconhecidas)", 1, ["Outra Substância", "Substância Desconhecida"]),
        ("Transtornos Não Relacionados a Substâncias", 1, ["Jogo"]),
    ],
    16: [  # Transtornos neurocognitivos
        ("Delirium", 1, ["Delirium"]),
        ("Transtornos Neurocognitivos Maiores e Leves", 1, ["Neurocognitivo"]),
    ],
    17: [  # Transtornos da personalidade (grupos A/B/C + outros)
        ("Transtornos da Personalidade do Grupo A", 1, ["Paranoide", "Esquizoide", "Esquizotípica"]),
        ("Transtornos da Personalidade do Grupo B", 1, ["Antissocial", "Borderline", "Histriônica", "Narcisista"]),
        ("Transtornos da Personalidade do Grupo C", 1, ["Evitativa", "Dependente", "Obsessivo"]),
        ("Outros Transtornos da Personalidade", 1, ["Mudança", "Especificado"]),
    ],
}

# itens que vazaram como "transtorno" mas são apenas cabeçalhos de subgrupo
# (sem critérios/seções próprios) — removidos da lista de transtornos.
DROP_ITEMS = {
    11: ["Transtornos do Sono Relacionados à Respiração"],
    15: ["Transtornos por Uso de Substâncias"],
}


def drop_fake_items(cat_index, items):
    names = set(DROP_ITEMS.get(cat_index, []))
    return [it for it in items if it["n"] not in names] if names else items


def apply_subgroups(cat_index, items):
    """Atribui item['sg']/['sgl'] por PALAVRA-CHAVE (independente da ordem do
    README) e REORDENA os itens para a ordem dos grupos do manifesto (e, dentro
    do grupo, pela ordem da palavra-chave). Itens sem grupo ficam no fim com
    sg=''. Devolve a lista reordenada (mutada in-place)."""
    spec = SUBGROUPS.get(cat_index)
    if not spec:
        return items

    def classify(name):
        for gi, (gname, glevel, kws) in enumerate(spec):
            for ki, kw in enumerate(kws):
                if kw in name:
                    return gi, ki, gname, glevel
        return len(spec), 0, "", 0   # sem grupo -> fim

    ungrouped = []
    keyed = []
    for orig_i, it in enumerate(items):
        gi, ki, gname, glevel = classify(it["n"])
        it["sg"], it["sgl"] = gname, glevel
        if gi == len(spec):                 # não casou em NENHUM grupo (nem nível superior)
            ungrouped.append(it["n"])
        keyed.append((gi, ki, orig_i, it))

    keyed.sort(key=lambda t: (t[0], t[1], t[2]))   # grupo, palavra-chave, ordem original
    items[:] = [t[3] for t in keyed]
    if ungrouped:
        print(f"  [subgrupos] cat {cat_index}: sem grupo: {sorted(ungrouped)}")
    return items


CODE_HEADING = re.compile(r"^#{3,4}\s+[\d(]")              # "### 300.02 (F41.1)" ou "#### ..."
CODE_PAIR = re.compile(r"(\d{3}(?:\.\d+)?)\s*\(([A-Z]\d{2}(?:\.\d+)?)\)[ \t]*([^\n*(:]{0,48})")
LETTER_RE = re.compile(r"^([A-N])\.(?=\s|[A-ZÀ-Ú])\s*(.*)$")  # A–N: alguns transtornos vão até I/J/K; tolera "C.A duração"
SUBITEM_RE = re.compile(r"^\s*(?:[a-z]|\d{1,2})[.)]\s")   # "a. ", "1. ", "2) " ...
# cabeçalho de bloco de especificador: "Especificar se:", "Determinar o subtipo:" ...
SPEC_HEAD_RE = re.compile(r"^\*?\s*(?:Especificar|Determinar)\b[^:]*:", re.IGNORECASE)
# linha de opção: "**Rótulo:** descrição" (rótulo pode ter código/prefixo)
SPEC_ITEM_RE = re.compile(r"^\*\*\s*(.+?)\s*\*\*\s*:?\s*(.*)$")
PAGE_FOOTER = re.compile(r"^\*\*\d+\*\*")
HEADING_ANY = re.compile(r"^#{1,6}\s+(.*)$")
# opção de especificador CODIFICADA: "**300.29 (F40.248) Situacional**..."
CODED_SPEC_ITEM = re.compile(r"^\*\*\s*\d{2,3}(?:\.\d+)?\s*\([A-Z]\d")
# código ICD-10-CM isolado (DSM-5-TR): cabeçalho "### F80.2", "### F95.1" etc.
TR_CODE_HEADING = re.compile(r"^#{2,4}\s+([A-TV-Z]\d{2}(?:\.\d+\w*)?)\s*$", re.MULTILINE)
# código ICD-10-CM em especificador de gravidade em negrito (substâncias):
# "**F10.10 Leve:**", "**F12.120 ...**"
TR_INLINE_CODE = re.compile(r"\*\*\s*([A-TV-Z]\d{2}\.\d+\w*)\b")


def normalize(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower().strip().rstrip(":").strip()
    return re.sub(r"\s+", " ", s)


def clean(text):
    text = text.replace("**", "").replace("*", "")
    text = text.replace("“", '"').replace("”", '"').replace("’", "'")
    text = text.replace("[NR]", " ")     # marcador de nota de rodapé do PDF
    # remove referências dangling a tabelas/figuras/quadros que não levam a nada
    text = re.sub(r"\s*\(ver (?:a |as |o |os )?(?:Tabela|Figura|Quadro)[^)]*\)", "", text)
    return re.sub(r"[ \t]+", " ", text).strip()


# Run-in heading do DSM: "**Rótulo. **texto..." (sub-rótulo em negrito no
# início do parágrafo). Preservar como hierarquia em vez de achatar.
RUNIN_RE = re.compile(r"^\*\*\s*([A-ZÀ-Ú][^*]{2,70}?[.:])\s*\*\*\s*(.*)$")


def make_body_entry(t):
    """Devolve {'lead','text'} se a linha for um run-in heading; senão string."""
    m = RUNIN_RE.match(t)
    if m:
        return {"lead": clean(m.group(1)), "text": clean(m.group(2))}
    return clean(t)


def body_text(entry):
    """Texto plano de uma entrada de corpo (string ou {'lead','text'})."""
    if isinstance(entry, dict):
        return (entry.get("lead", "") + " " + entry.get("text", "")).strip()
    return entry


# várias opções em negrito coladas numa linha ("**A:** desc **B:** desc") —
# quebra antes de cada novo rótulo em negrito (inicial maiúscula). A janela é
# larga (até 100 chars) porque alguns rótulos são longos (especificadores de
# curso ~52; subtipos de fobia com exemplos "F40.23x Sangue-injeção-ferimentos
# (p. ex., agulhas, …)" ~80). Só atua em contexto de especificador.
SPEC_OPT_SPLIT = re.compile(r'(?<=\S)\s+(?=\*\*[A-ZÀ-Ú][^*\n]{0,100}(?::|\*\*))')

# Especificadores de CURSO (espectro psicótico): o PDF cola vários rótulos num
# único negrito sem separador ("…agudoEpisódios múltiplos…parcial…completaContínuo:").
# São vocabulário FECHADO do DSM-5-TR; reinsere as fronteiras de opção (fecha e
# reabre o negrito) onde um rótulo conhecido aparece grudado (minúscula→Rótulo).
COURSE_JAM = re.compile(
    r"(?<=[a-zà-ú])"
    r"(?=(?:Primeiro episódio, atualmente\b|Episódios múltiplos, atualmente\b|Contínuo:))")
# Matriz de códigos por SUBSTÂNCIA/SUBTIPO: o PDF cola vários rótulos
# codificados num único negrito ("…inicialF10.11 Leve, em remissão
# sustentadaF10.20 Moderada:"; subtipos de fobia "…cães).F40.228 Ambiente…").
# Fronteira = código ICD-10-CM (Fxx.xx) grudado logo após minúscula, ")" ou "."
# (sem separador). O ":" inserido em rótulo sem ":" é removido pelo rstrip.
CODE_JAM = re.compile(r"(?<=[a-zà-ú).])(?=F\d{2}\.\d)")
# Especificadores "Com…/Sem…" colados sem separador — de humor com pág. ("Com
# sintomas ansiosos (p. 169-170)Com características mistas…") ou de comorbidade
# ("…por uso de substânciasCom condição médica…"; sono, autismo). Fronteira =
# "Com"/"Sem" (maiúsculo) grudado logo após minúscula, dígito ou ")" (sem
# espaço); o "Com"/"sem" correto vem com espaço antes e não dispara.
PAGEREF_JAM = re.compile(r"(?<=[a-zà-ú0-9)])(?=(?:Com|Sem)\s)")
# referência de página do PDF impresso ("(p. 169-170)"), inútil no app.
PAGE_REF = re.compile(r"\s*\(p\.\s*[\d\-–,\s]+\)")


def spec_add(block, raw):
    """Adiciona uma ou mais opções de especificador a um bloco. Se 'raw' traz
    várias opções em negrito coladas (curso, códigos por substância ou
    especificadores de humor com pág.), separa cada uma."""
    raw = COURSE_JAM.sub(":** **", raw)    # de-jam dos especificadores de curso
    raw = CODE_JAM.sub(":** **", raw)      # de-jam da matriz de códigos
    raw = PAGEREF_JAM.sub("** **", raw)    # de-jam dos especificadores de humor
    for part in SPEC_OPT_SPLIT.split(raw.strip()):
        _spec_add_one(block, part)


def _spec_add_one(block, raw):
    raw = re.sub(r"^\*\s+", "", raw.strip())   # remove "* " de fechamento de itálico
    if not raw:
        return
    m = SPEC_ITEM_RE.match(raw)
    if m:
        label = clean(m.group(1)).rstrip(": ")
        label = PAGE_REF.sub("", label).strip()    # tira "(p. …)" do rótulo
        desc = clean(m.group(2))
        block["items"].append({"label": label, "desc": desc})
        return
    txt = clean(raw)
    if not txt:
        return
    if block["items"]:                          # continuação -> última opção
        prev = block["items"][-1]
        prev["desc"] = (prev["desc"] + " " + txt).strip()
    else:
        block["items"].append({"label": "", "desc": txt})


def is_section_heading(line):
    """Se a linha é um cabeçalho de seção narrativa reconhecido, devolve o
    título de exibição (ou '' se for 'Critérios Diagnósticos'); senão None."""
    m = HEADING_ANY.match(line)
    if not m:
        return None
    if CODE_HEADING.match(line):
        return None
    norm = normalize(m.group(1))
    for key, disp in SECTION_MAP:
        if norm.startswith(key):
            return disp if disp else ""
    return None


def strip_footer(line):
    # cabeçalho de página colado ANTES de uma letra de critério ou de um
    # "Especificar/Determinar": "**172** Transtornos Depressivos B. Um..." ->
    # "B. Um..."; "**430** Disfunções Sexuais *Determinar*..." -> "*Determinar*..."
    line = re.sub(
        r"^\*\*\d+\*\*\s+[A-ZÀ-Ú][^.]*?\s+(?=(?:[A-H]\.\s|\*{0,2}(?:Especificar|Determinar)\b))",
        "", line)
    line = re.sub(r"\*\*\d+\*\*\s+[A-ZÀ-Ú][^.]*?(?=[A-ZÀ-Ú][a-z])", "", line)
    return line.strip()


def extract_codes(head_text):
    """Extrai códigos (DSM, CID, rótulo) da região de cabeçalho/critérios."""
    codes = []
    seen = set()
    for m in CODE_PAIR.finditer(head_text):
        dsm, cid, label = m.group(1), m.group(2), clean(m.group(3))
        label = label.strip(" .:-")
        if len(label) < 2:
            label = ""
        key = (dsm, cid)
        if key in seen:
            continue
        seen.add(key)
        codes.append({"dsm": dsm, "cid": cid, "label": label})
    # DSM-5-TR: código ICD-10-CM isolado (sem o par DSM-IV "300.x (Fxx)")
    if not codes:
        for m in TR_CODE_HEADING.finditer(head_text):
            cid = m.group(1)
            if cid in seen:
                continue
            seen.add(cid)
            codes.append({"dsm": "", "cid": cid, "label": ""})
    # DSM-5-TR substâncias: o código vem no especificador em negrito do tipo
    # "**F10.10 Leve:**" (uso) / "**F10.120 ...**" (intoxicação/abstinência).
    # Pega o 1º como código-base (a gravidade/comorbidade muda o código).
    if not codes:
        m = TR_INLINE_CODE.search(head_text)
        if m:
            codes.append({"dsm": "", "cid": m.group(1), "label": ""})
    return codes


# letra de critério (A.–H.) colada no MEIO da linha, após fim de frase/sub-item:
# "...trabalho. B. Presença..." -> quebra antes do "B." para o parser reconhecer.
INLINE_LETTER = re.compile(r'([.\)\]"”])\s+([A-N])\.\s+(?=[A-ZÀ-Ú“"])')
# bloco de especificador colado no MEIO da linha (TR): "…obsessivo-compulsivo).
# *Especificar* se: …" -> quebra antes de cada *Especificar*/*Determinar*/"Nota
# para codificação" para o parser separá-los do critério. O itálico (*…*) marca
# o cabeçalho no DSM, evitando falsos positivos com "especificar" em prosa.
INLINE_SPEC = re.compile(
    r'(?<=\S)[ \t]+(?=\*{1,2}(?:Especificar|Determinar)\b)'                      # cabeçalho em itálico
    r'|(?<=[.\)\]”"])[ \t]+(?=(?:Especificar|Determinar)\b[^.:\n]{0,60}:)'       # cabeçalho simples após fim de frase
    r'|(?<=\S)[ \t]+(?=\*{0,2}Nota para codifica)')                             # nota de codificação


def split_inline_criteria(lines):
    out = []
    for ln in lines:
        ln = INLINE_SPEC.sub("\n", ln)
        ln = INLINE_LETTER.sub(lambda m: m.group(1) + "\n" + m.group(2) + ". ", ln)
        out.extend(ln.split("\n"))
    return out


# item numerado promovido a H3 pelo PDF (ex.: "### 1. Esforços…", "### 1. Desatenção:")
NUM_H3 = re.compile(r"^\d{1,2}[.)]\s")
# marcador de item numerado "N. Xxxx" (Xxx começa com maiúscula/aspas) — usado
# para dividir a lista politética de critérios que o PDF achatou em um parágrafo
# (transtornos da personalidade e categorias "Outro … Especificado").
NUM_MARK = re.compile(r'(\d{1,2})[.)]\s+(?=[A-ZÀ-Ú"“])')


def split_numbered_list(text):
    """Se 'text' é uma frase-tronco seguida de uma lista numerada 1., 2., 3. …
    (sequencial a partir de 1, ≥2 itens), devolve (tronco, [itens]); senão None.
    A varredura é sequencial (só aceita o próximo número esperado), de modo que
    "Critério 5.)" ou anos como "2 a 13 dias" no meio de um item não disparam
    uma divisão falsa."""
    markers, expected = [], 1
    for m in NUM_MARK.finditer(text):
        if int(m.group(1)) == expected:
            markers.append((m.start(), m.end()))
            expected += 1
    if len(markers) < 2:
        return None
    stem = text[:markers[0][0]].strip()
    items = []
    for i, (st, en) in enumerate(markers):
        end = markers[i + 1][0] if i + 1 < len(markers) else len(text)
        items.append(clean(text[en:end].strip()))
    return stem, items


# marcador de nota de rodapé do PDF ("[NR]") + sufixo de nota residual ("...perda.1")
NR_MARK = re.compile(r"\s*\[NR\]\s*")
# cabeçalho de nota inline ("Nota:", "Nota para codificação:")
NOTE_HEAD = re.compile(r"(?i)\bNota(\s+para\s+codifica\w*)?\s*[:.]\s*")
# run de especificadores com referência de página que vazou para a nota
# ("Com início no periparto (p. 172-174)Com padrão sazonal (p. 174-175)") — já
# constam (de-jammed) no bloco de especificador; remover da nota.
LEAKED_SPEC = re.compile(r"(?:(?:Com|Sem|Tipo)\b[^.]*?\(p\.\s*[\d\-–,\s]+\)\s*)+\s*$")


def split_notes(notes):
    """Recebe as linhas de nota coletadas e devolve uma LISTA de blocos
    {text, kind} — separando notas inline ("… Nota: … Nota: …") e classificando
    "Nota para codificação" (kind='codificacao'). Remove o marcador [NR] e o run
    de especificadores com pág. que vazou para o fim da nota."""
    raw = " ".join(notes).strip()
    raw = NR_MARK.sub(" ", raw)
    raw = re.sub(r"\s+", " ", raw).strip()
    if not raw:
        return []
    marks = list(NOTE_HEAD.finditer(raw))
    blocks = []
    if not marks:
        blocks.append({"text": raw, "kind": "nota"})
    else:
        pre = raw[: marks[0].start()].strip()
        if pre:
            blocks.append({"text": pre, "kind": "nota"})
        for i, mk in enumerate(marks):
            end = marks[i + 1].start() if i + 1 < len(marks) else len(raw)
            body = raw[mk.end():end].strip()
            if body:
                kind = "codificacao" if mk.group(1) else "nota"
                blocks.append({"text": body, "kind": kind})
    out = []
    for b in blocks:
        t = LEAKED_SPEC.sub("", b["text"]).strip()
        if t:
            b["text"] = t
            out.append(b)
    return out


def parse_criteria(head_lines):
    """Extrai (criteriaIntro, criteria[], specifier, note) da região de
    critérios. 'Nota:' e 'Especificar' NÃO entram no texto do critério:
    a nota vira um bloco à parte e o especificar vai para o specifier."""
    intro, criteria, spec_blocks, notes = [], [], [], []
    mode = "intro"           # intro -> crit -> note -> spec
    cur = None
    cur_group = None         # grupo ativo (ex.: "Episódio Maníaco")
    pending_group = None     # H4 visto, só vira grupo se um critério "A" seguir
    last_letter = None       # última letra de critério aceita (validação sequencial)
    for raw in head_lines:
        s = raw.strip()
        if not s:
            continue
        if s.startswith("#"):
            htext = s.lstrip("#").strip()
            # item numerado promovido a H3 pelo PDF (ex.: "### 1. Esforços…",
            # "### 1. Desatenção: …") NÃO é cabeçalho — é conteúdo de critério.
            # Rebaixa para linha de corpo e segue o fluxo normal (intro/crit).
            if s.startswith("###") and NUM_H3.match(htext):
                s = htext
            else:
                # H3+ descritivo (não código, não "Critérios Diagnósticos", não
                # o título H1) = grupo de critérios: versão por idade (TEPT,
                # disforia) ou tipo de episódio (bipolar). Vira grupo se um
                # critério "A" seguir.
                if s.startswith("###"):
                    nh = normalize(htext)
                    is_code = bool(CODE_HEADING.match(s)) or bool(re.match(r"^[A-TV-Z]\d{2}(?:\.\d+\w*)?$", htext))
                    if (htext and re.match(r"[A-Za-zÀ-ÿ]", htext) and not is_code
                            and not nh.startswith("criterios diagnosticos")):
                        pending_group = clean(htext)
                continue                  # títulos/cabeçalhos/códigos
        if s in ("---",) or s.startswith("*Categoria:"):
            continue
        if PAGE_FOOTER.match(s):
            s = strip_footer(s)
            if not s:
                continue

        # detecção sobre o texto JÁ limpo (sem ** / * do markdown)
        low = normalize(clean(s))

        # uma letra de critério (A., B., ...) reabre o modo critério — mesmo após
        # um "Especificar"/"Nota" inline (ex.: gravidade entre A e B). Validação
        # SEQUENCIAL: aceita "A" (início/novo grupo) ou a próxima letra (tolera 1
        # salto p/ critério perdido pelo PDF); rejeita letras fora de ordem (ex.:
        # uma inicial "V." solta). Necessário porque o range agora vai até N.
        m = LETTER_RE.match(s)
        if m:
            letter = m.group(1)
            seq_ok = (letter == "A") or (last_letter is not None and 0 < (ord(letter) - ord(last_letter)) <= 2)
            if seq_ok:
                mode = "crit"
                if letter == "A" and pending_group:   # novo conjunto de critérios
                    cur_group = pending_group
                pending_group = None                  # H4 não seguido de "A" é descartado
                cur = {"letter": letter, "text": clean(m.group(2))}
                if cur_group:
                    cur["group"] = cur_group
                criteria.append(cur)
                last_letter = letter
                continue
            # letra fora de ordem: não é um novo critério -> cai como texto abaixo
        if low.startswith("especificar") or low.startswith("determinar"):
            mode = "spec"          # novo bloco de especificador
            hm = SPEC_HEAD_RE.match(s)
            head = clean(hm.group(0) if hm else s).rstrip(": ")
            blk = {"head": head, "items": []}
            spec_blocks.append(blk)
            rest = s[hm.end():] if hm else ""   # 1ª opção inline (ex.: Bipolar)
            if rest.strip().strip("*").strip():
                spec_add(blk, rest)
            continue
        if re.match(r"nota\b", low):        # "Nota:" sai do critério -> bloco à parte
            mode = "note"
            c = clean(s)
            if c not in notes:              # evita notas duplicadas
                notes.append(c)
            continue

        # um sub-item (a., b., 1., 2.) encerra uma nota inline e RETOMA o
        # critério atual — senão a lista de sintomas iria toda para a nota
        if mode == "note" and cur is not None and SUBITEM_RE.match(s):
            mode = "crit"

        # uma opção CODIFICADA de especificador após uma "Nota" (ex.: tipos de
        # fobia separados por uma "Nota para codificação") retoma o especificador
        if mode == "note" and spec_blocks and CODED_SPEC_ITEM.match(s):
            mode = "spec"

        if mode == "spec":
            if not spec_blocks:
                spec_blocks.append({"head": "", "items": []})
            spec_add(spec_blocks[-1], s)
        elif mode == "note":
            c = clean(s)
            if c not in notes:
                notes.append(c)
        elif mode == "crit" and cur is not None:
            # um H3 de texto seguido de SUB-ITEM (número) dentro de um critério é
            # um sub-cabeçalho de categoria (ex.: TEA crit. B: "Sintomas de
            # Intrusão", "Humor Negativo"…), não um grupo de critérios A/B.
            # Reincorpora-o ao texto do critério para não perder a estrutura.
            if pending_group and SUBITEM_RE.match(s):
                cur["text"] += "\n" + pending_group
                pending_group = None
            extra = clean(s)
            if extra:
                cur["text"] += "\n" + extra
        elif mode == "intro":
            intro.append(clean(s))

    note = split_notes(notes)        # LISTA de blocos {text, kind}
    # remove blocos de especificador vazios
    spec_blocks = [b for b in spec_blocks if b["items"]]

    intro_text = " ".join(intro).strip()
    # Sem critérios "A./B." mas com uma lista politética numerada na introdução
    # (transtornos da personalidade — critério único; categorias "Outro …
    # Especificado" — exemplos). Divide a lista em itens, restaurando a
    # estrutura: o tronco vira a introdução e cada "N." vira um critério.
    if not criteria:
        parsed = split_numbered_list(intro_text)
        if parsed:
            stem, items = parsed
            intro_text = stem
            for i, txt in enumerate(items, 1):
                criteria.append({"letter": str(i), "text": txt})

    return intro_text, criteria, spec_blocks, note


def parse_sections(lines):
    """Percorre o doc e coleta as seções narrativas reconhecidas, em ordem.
    Cabeçalhos não reconhecidos (fragmentos de título quebrados pelo PDF) são
    absorvidos como texto da seção corrente."""
    sections = []
    cur = None
    for raw in lines:
        s = raw.rstrip()
        disp = is_section_heading(raw)
        if disp is not None:
            if disp == "":          # "Critérios Diagnósticos" -> ignora aqui
                cur = None
                continue
            cur = {"title": disp, "body": []}
            sections.append(cur)
            continue
        if cur is None:
            continue
        t = s.strip()
        if not t:
            continue
        if CODE_HEADING.match(raw):
            continue
        if t.startswith("#"):
            t = HEADING_ANY.match(raw).group(1)   # absorve fragmento de título
        if PAGE_FOOTER.match(t):
            t = strip_footer(t)
            if not t:
                continue
        entry = make_body_entry(t)
        # linha começando em minúscula/"(" é continuação de um parágrafo quebrado
        # pelo PDF (ex.: "…parentes\n\nbiológicos…") — funde na entrada anterior em
        # vez de criar uma nova (que renderizaria com identação errada, sem o
        # sub-rótulo). Só funde texto plano (não um novo run-in heading).
        if (cur["body"] and isinstance(entry, str) and re.match(r"^[a-zà-ÿ(]", t)):
            prev = cur["body"][-1]
            if isinstance(prev, dict):
                prev["text"] = (prev["text"] + " " + entry).strip()
            else:
                cur["body"][-1] = (prev + " " + entry).strip()
        else:
            cur["body"].append(entry)
    # remove seções vazias
    return [sec for sec in sections if sec["body"]]


def first_paragraph(text):
    return text.split("\n")[0] if text else ""


def shorten(summary, limit=300, hard=520):
    s = summary.strip()
    if len(s) <= hard:                       # curto/completo o bastante -> inteiro
        return s
    # corta numa fronteira de frase: 1ª ". " a partir de ~limit
    end = s.find(". ", max(0, limit - 60), hard)
    if end != -1:
        return s[: end + 1]
    dot = s[:limit].rfind(". ")
    if dot > 120:
        return s[: dot + 1]
    cut = s[:limit].rstrip()
    sp = cut.rfind(" ")
    return (cut[:sp] if sp > 120 else cut) + "…"


def parse_transtorno(path, display_name, tldr_entry=None):
    with open(path, encoding="utf-8") as f:
        raw = f.read()
    lines = raw.split("\n")

    # título (remove marcadores de itálico * que vazaram do markdown)
    title = display_name.replace("*", "")
    for ln in lines:
        if ln.startswith("# "):
            title = ln[2:].strip().replace("*", "")
            break

    # região de cabeçalho = do início até a 1ª seção narrativa reconhecida
    sec_start = len(lines)
    for i, ln in enumerate(lines):
        if is_section_heading(ln):
            sec_start = i
            break
    head_lines = split_inline_criteria(lines[:sec_start])
    head_text = "\n".join(head_lines)

    codes = extract_codes(head_text)
    ov = CODE_OVERRIDES.get(title)
    if ov:
        raw = ov["codes"] if "codes" in ov else [{"cid": ov.get("cid", ""), "label": ""}]
        # DSM-5-TR usa apenas ICD-10-CM: descarta o código DSM-IV (300.x) do override,
        # mantendo só o(s) CID. Se o override não tinha CID, mantém a extração TR.
        ov_codes = [{"dsm": "", "cid": c.get("cid", ""), "label": c.get("label", "")} for c in raw if c.get("cid")]
        if ov_codes:
            codes = ov_codes
    criteria_intro, criteria, specifier, criteria_note = parse_criteria(head_lines)
    # enxuga rótulos de grupo que repetem o nome do transtorno: "Transtorno X em
    # Crianças…" -> "Em Crianças…" (o nome já está no título da ficha)
    tnorm = normalize(title)
    for cr in criteria:
        g = cr.get("group")
        if g and normalize(g).startswith(tnorm) and len(normalize(g)) > len(tnorm) + 1:
            short = g[len(title):].strip(" –-—:")
            cr["group"] = (short[:1].upper() + short[1:]) if short else g
    # especificador reconstruído (tabela achatada pelo PDF)
    if title in SPECIFIER_OVERRIDES:
        specifier = SPECIFIER_OVERRIDES[title]
    # correções pontuais de texto (erros da camada de texto do PDF)
    for cr in criteria:
        cr["text"] = apply_text_fixes(cr["text"])
    sections = parse_sections(lines)

    # substitui/anexa tabelas (imagem recortada do PDF) em seções existentes
    assets = SECTION_ASSETS.get(title)
    if assets:
        for sec in sections:
            a = assets.get(sec["title"])
            if not a:
                continue
            body = sec["body"]
            if a.get("append"):
                pass  # mantém todo o corpo; só anexa a tabela ao fim
            elif "drop" in a:
                for s, e in sorted(a["drop"], reverse=True):
                    body = body[:s] + body[e:]
                sec["body"] = body
            else:
                sec["body"] = body[: a.get("keep_first", 0)]
            if "table" in a:
                sec["table"] = TABLES[a["table"]]
            elif "images" in a:
                sec["images"] = a["images"]
            # (sem table/images = apenas apara o corpo, ex.: remover tabela achatada)
            if a.get("caption"):
                sec["caption"] = a["caption"]

    # adiciona seções novas só com imagem (tabelas de nível-capítulo)
    for e in ADD_SECTIONS.get(title, []):
        sec = {"title": e["title"], "body": []}
        if "table" in e:
            sec["table"] = TABLES[e["table"]]
        else:
            sec["images"] = e["images"]
        if e.get("caption"):
            sec["caption"] = e["caption"]
        sections.append(sec)

    # resumo: 1ª seção "Características diagnósticas" -> senão intro -> senão 1º critério
    summary = ""
    for sec in sections:
        if sec["title"] == "Características diagnósticas":
            summary = body_text(sec["body"][0])
            break
    if not summary:
        summary = first_paragraph(criteria_intro)
    if not summary and criteria:
        summary = first_paragraph(criteria[0]["text"])
    summary = shorten(summary)

    # resumo híbrido curado (linha autoral + fatos-chave) p/ EXIBIÇÃO; o
    # `summary` clínico fica intacto (flashcards/quiz/busca). Ausente -> fallback.
    te = tldr_entry or {}
    tldr = (te.get("tldr") or "").strip()
    facts = te.get("facts") or None

    primary = codes[0] if codes else {"dsm": "", "cid": "", "label": ""}
    return {
        "n": title,
        "codes": codes,
        "cid": primary["cid"],
        "dsm": primary["dsm"],
        "code": primary["cid"] or primary["dsm"],
        "criteriaIntro": criteria_intro,
        "criteria": criteria,
        "criteriaNote": criteria_note,
        "specifier": specifier,
        "sections": sections,
        "summary": summary,
        "tldr": tldr,
        "facts": facts,
    }


def parse_category_readme(folder):
    readme = os.path.join(folder, "README.md")
    items = []
    if not os.path.exists(readme):
        return items
    with open(readme, encoding="utf-8") as f:
        for ln in f:
            m = re.match(r"^\|\s*(.+?)\s*\|\s*\[([^\]]+)\]\([^)]+\)\s*\|", ln)
            if not m:
                continue
            name, fname = m.group(1).strip(), m.group(2).strip()
            if name.startswith("*") or name.lower() == "transtorno":
                continue
            if not fname.endswith(".md") or fname == "README.md":
                continue
            items.append((name, fname))
    return items


def load_tldr_facts():
    """Lê build/tldr_facts.json -> (por_chave, por_nome). 'por_nome' (nome
    normalizado) é só fallback e descarta nomes duplicados. Ausente = {}, {}."""
    if not os.path.exists(TLDR_FACTS):
        return {}, {}
    with open(TLDR_FACTS, encoding="utf-8") as f:
        data = json.load(f)
    by_name, dup = {}, set()
    for k, v in data.items():
        nm = normalize(v.get("n", ""))
        if not nm:
            continue
        if nm in by_name or nm in dup:
            by_name.pop(nm, None)
            dup.add(nm)
        else:
            by_name[nm] = v
    return data, by_name


def main():
    folders = sorted(
        d for d in os.listdir(CAT_DIR)
        if os.path.isdir(os.path.join(CAT_DIR, d)) and re.match(r"^\d{2}-", d)
    )
    assert len(folders) == 20, f"esperava 20 categorias, achei {len(folders)}"

    tf_by_key, tf_by_name = load_tldr_facts()

    categories, flashcards = [], []
    for idx, folder in enumerate(folders):
        color, name, prog = CAT_META[idx]
        fpath = os.path.join(CAT_DIR, folder)
        items = []
        for disp_name, fname in parse_category_readme(fpath):
            full = os.path.join(fpath, fname)
            if os.path.exists(full):
                key = folder + "::" + fname[:-3]      # tira ".md"
                entry = tf_by_key.get(key) or tf_by_name.get(normalize(disp_name))
                items.append(parse_transtorno(full, disp_name, entry))

        items = drop_fake_items(idx, items)
        apply_subgroups(idx, items)
        categories.append({"name": name, "color": color, "prog": prog, "items": items})

        picked = 0
        for it in items:
            if picked >= 2:
                break
            if it["summary"] and it["criteria"]:
                flashcards.append({"front": it["n"], "back": it["summary"]})
                picked += 1

    data = {"categories": categories, "flashcards": flashcards}
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    header = (
        "/* GERADO por build/build_content.py — não edite à mão.\n"
        "   Reconstrua com: python build/build_content.py */\n"
        "window.DSM_CONTENT = "
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header + payload + ";\n")

    total = sum(len(c["items"]) for c in categories)
    with_crit = sum(1 for c in categories for it in c["items"] if it["criteria"])
    with_sec = sum(1 for c in categories for it in c["items"] if it["sections"])
    print(f"Categorias: {len(categories)}")
    print(f"Transtornos: {total}  (com critérios: {with_crit} · com seções: {with_sec})")
    print(f"Flashcards: {len(flashcards)}")
    print(f"Gerado: {OUT}  ({os.path.getsize(OUT)//1024} KB)")


if __name__ == "__main__":
    main()
