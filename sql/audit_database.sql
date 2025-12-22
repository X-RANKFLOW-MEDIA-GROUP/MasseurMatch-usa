-- ============================================================================
-- AUDITORIA COMPLETA DO BANCO DE DADOS SUPABASE
-- ============================================================================
-- Este script lista TUDO que existe no banco de dados para conferência
-- Execute no SQL Editor do Supabase
-- ============================================================================

-- 1. TODAS AS TABELAS E SEUS DETALHES
-- ============================================================================
SELECT
    '=== TABELAS ===' as tipo,
    '' as schema,
    '' as nome,
    '' as detalhes;

SELECT
    'TABELA' as tipo,
    schemaname as schema,
    tablename as nome,
    concat(
        'Colunas: ', (
            SELECT count(*)
            FROM information_schema.columns c
            WHERE c.table_schema = schemaname
            AND c.table_name = tablename
        ),
        ' | Linhas estimadas: ', n_live_tup
    ) as detalhes
FROM pg_stat_user_tables
ORDER BY schemaname, tablename;

-- 2. TODAS AS COLUNAS DE CADA TABELA
-- ============================================================================
SELECT
    '=== ESTRUTURA DAS TABELAS ===' as tipo,
    '' as tabela,
    '' as coluna,
    '' as tipo_dados,
    '' as nullable,
    '' as default_value;

SELECT
    'COLUNA' as tipo,
    table_name as tabela,
    column_name as coluna,
    data_type as tipo_dados,
    is_nullable as nullable,
    column_default as default_value
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 3. TODAS AS CHAVES PRIMÁRIAS
-- ============================================================================
SELECT
    '=== CHAVES PRIMÁRIAS ===' as tipo,
    '' as tabela,
    '' as colunas;

SELECT
    'PRIMARY KEY' as tipo,
    tc.table_name as tabela,
    string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as colunas
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
GROUP BY tc.table_name
ORDER BY tc.table_name;

-- 4. TODAS AS CHAVES ESTRANGEIRAS (RELACIONAMENTOS)
-- ============================================================================
SELECT
    '=== CHAVES ESTRANGEIRAS (RELACIONAMENTOS) ===' as tipo,
    '' as tabela_origem,
    '' as coluna_origem,
    '' as tabela_destino,
    '' as coluna_destino,
    '' as on_delete;

SELECT
    'FOREIGN KEY' as tipo,
    tc.table_name as tabela_origem,
    kcu.column_name as coluna_origem,
    ccu.table_name as tabela_destino,
    ccu.column_name as coluna_destino,
    rc.delete_rule as on_delete
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 5. TODOS OS ÍNDICES
-- ============================================================================
SELECT
    '=== ÍNDICES ===' as tipo,
    '' as tabela,
    '' as nome_indice,
    '' as colunas,
    '' as e_unico;

SELECT
    'INDEX' as tipo,
    tablename as tabela,
    indexname as nome_indice,
    indexdef as definicao,
    CASE WHEN indexdef LIKE '%UNIQUE%' THEN 'SIM' ELSE 'NÃO' END as e_unico
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 6. TODAS AS VIEWS
-- ============================================================================
SELECT
    '=== VIEWS ===' as tipo,
    '' as nome,
    '' as definicao;

SELECT
    'VIEW' as tipo,
    table_name as nome,
    view_definition as definicao
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- 7. TODAS AS FUNÇÕES/STORED PROCEDURES
-- ============================================================================
SELECT
    '=== FUNÇÕES/PROCEDURES ===' as tipo,
    '' as nome,
    '' as argumentos,
    '' as tipo_retorno;

SELECT
    'FUNCTION' as tipo,
    routine_name as nome,
    COALESCE(
        (SELECT string_agg(parameter_name || ' ' || data_type, ', ')
         FROM information_schema.parameters p
         WHERE p.specific_name = r.specific_name
         AND parameter_mode = 'IN'),
        'sem argumentos'
    ) as argumentos,
    COALESCE(data_type, type_udt_name) as tipo_retorno
FROM information_schema.routines r
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 8. TODAS AS POLICIES (RLS - Row Level Security)
-- ============================================================================
SELECT
    '=== POLICIES (RLS) ===' as tipo,
    '' as tabela,
    '' as nome_policy,
    '' as comando,
    '' as roles,
    '' as using_expression;

SELECT
    'POLICY' as tipo,
    schemaname || '.' || tablename as tabela,
    policyname as nome_policy,
    cmd as comando,
    roles::text as roles,
    qual as using_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 9. TABELAS COM RLS HABILITADO/DESABILITADO
-- ============================================================================
SELECT
    '=== STATUS RLS DAS TABELAS ===' as tipo,
    '' as tabela,
    '' as rls_habilitado;

SELECT
    'RLS STATUS' as tipo,
    tablename as tabela,
    CASE
        WHEN rowsecurity THEN 'HABILITADO'
        ELSE 'DESABILITADO'
    END as rls_habilitado
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 10. TODOS OS TRIGGERS
-- ============================================================================
SELECT
    '=== TRIGGERS ===' as tipo,
    '' as tabela,
    '' as nome_trigger,
    '' as evento,
    '' as funcao;

SELECT
    'TRIGGER' as tipo,
    event_object_table as tabela,
    trigger_name as nome_trigger,
    event_manipulation as evento,
    action_statement as funcao
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 11. STORAGE BUCKETS (se houver)
-- ============================================================================
SELECT
    '=== STORAGE BUCKETS ===' as tipo,
    '' as nome,
    '' as publico;

SELECT
    'BUCKET' as tipo,
    name,
    CASE WHEN public THEN 'PÚBLICO' ELSE 'PRIVADO' END as publico
FROM storage.buckets
ORDER BY name;

-- 12. EXTENSÕES INSTALADAS
-- ============================================================================
SELECT
    '=== EXTENSÕES POSTGRESQL ===' as tipo,
    '' as nome,
    '' as versao;

SELECT
    'EXTENSION' as tipo,
    extname as nome,
    extversion as versao
FROM pg_extension
ORDER BY extname;

-- 13. SEQUENCES (AUTO INCREMENT)
-- ============================================================================
SELECT
    '=== SEQUENCES ===' as tipo,
    '' as nome,
    '' as ultimo_valor;

SELECT
    'SEQUENCE' as tipo,
    sequencename as nome,
    last_value::text as ultimo_valor
FROM pg_sequences
WHERE schemaname = 'public'
ORDER BY sequencename;

-- 14. CONSTRAINTS ÚNICAS
-- ============================================================================
SELECT
    '=== CONSTRAINTS ÚNICAS ===' as tipo,
    '' as tabela,
    '' as constraint_name,
    '' as colunas;

SELECT
    'UNIQUE CONSTRAINT' as tipo,
    tc.table_name as tabela,
    tc.constraint_name,
    string_agg(kcu.column_name, ', ') as colunas
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- 15. CHECK CONSTRAINTS
-- ============================================================================
SELECT
    '=== CHECK CONSTRAINTS ===' as tipo,
    '' as tabela,
    '' as constraint_name,
    '' as check_clause;

SELECT
    'CHECK CONSTRAINT' as tipo,
    tc.table_name as tabela,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================================================
-- RESUMO EXECUTIVO
-- ============================================================================
SELECT '=== RESUMO EXECUTIVO ===' as categoria, '' as qtd;

SELECT 'Total de Tabelas' as categoria, count(*)::text as qtd
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
UNION ALL
SELECT 'Total de Views' as categoria, count(*)::text as qtd
FROM information_schema.views
WHERE table_schema = 'public'
UNION ALL
SELECT 'Total de Funções' as categoria, count(*)::text as qtd
FROM information_schema.routines
WHERE routine_schema = 'public'
UNION ALL
SELECT 'Total de Policies' as categoria, count(*)::text as qtd
FROM pg_policies
WHERE schemaname = 'public'
UNION ALL
SELECT 'Total de Triggers' as categoria, count(*)::text as qtd
FROM information_schema.triggers
WHERE trigger_schema = 'public'
UNION ALL
SELECT 'Total de Storage Buckets' as categoria, count(*)::text as qtd
FROM storage.buckets;
