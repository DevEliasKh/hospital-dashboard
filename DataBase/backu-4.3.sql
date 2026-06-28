--
-- PostgreSQL database dump
--

\restrict vhO6pEtB1RXjo5A6VhnX7ScN3Uk1j81B9tE3AmtvsqjfOwago8fOp06qa3FMR9S

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-24 23:51:04 +0330

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 895 (class 1247 OID 16538)
-- Name: schedule_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.schedule_status AS ENUM (
    'Draft',
    'Published',
    'Locked'
);


ALTER TYPE public.schedule_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 16553)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id integer,
    action character varying(50) NOT NULL,
    table_name character varying(50) NOT NULL,
    record_id integer,
    old_data jsonb,
    new_data jsonb,
    ip_address character varying(50),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16552)
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4251 (class 0 OID 0)
-- Dependencies: 235
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- TOC entry 226 (class 1259 OID 16438)
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16437)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- TOC entry 4252 (class 0 OID 0)
-- Dependencies: 225
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- TOC entry 238 (class 1259 OID 16571)
-- Name: login_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_logs (
    id bigint NOT NULL,
    username character varying(100),
    success boolean NOT NULL,
    ip_address character varying(50),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.login_logs OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16570)
-- Name: login_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4253 (class 0 OID 0)
-- Dependencies: 237
-- Name: login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_logs_id_seq OWNED BY public.login_logs.id;


--
-- TOC entry 232 (class 1259 OID 16482)
-- Name: nurse_schedule_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nurse_schedule_members (
    id integer NOT NULL,
    schedule_id integer NOT NULL,
    nurse_id integer NOT NULL
);


ALTER TABLE public.nurse_schedule_members OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16481)
-- Name: nurse_schedule_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nurse_schedule_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nurse_schedule_members_id_seq OWNER TO postgres;

--
-- TOC entry 4254 (class 0 OID 0)
-- Dependencies: 231
-- Name: nurse_schedule_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nurse_schedule_members_id_seq OWNED BY public.nurse_schedule_members.id;


--
-- TOC entry 224 (class 1259 OID 16424)
-- Name: nurses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nurses (
    id integer NOT NULL,
    personnel_number character varying(20) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    active boolean DEFAULT true
);


ALTER TABLE public.nurses OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16423)
-- Name: nurses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nurses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nurses_id_seq OWNER TO postgres;

--
-- TOC entry 4255 (class 0 OID 0)
-- Dependencies: 223
-- Name: nurses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nurses_id_seq OWNED BY public.nurses.id;


--
-- TOC entry 222 (class 1259 OID 16407)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(30) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16406)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4256 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 230 (class 1259 OID 16461)
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id integer NOT NULL,
    department_id integer NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    status public.schedule_status DEFAULT 'Draft'::public.schedule_status NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    published_at timestamp without time zone,
    locked_at timestamp without time zone,
    created_by integer,
    updated_by integer,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16460)
-- Name: schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedules_id_seq OWNER TO postgres;

--
-- TOC entry 4257 (class 0 OID 0)
-- Dependencies: 229
-- Name: schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;


--
-- TOC entry 234 (class 1259 OID 16504)
-- Name: shift_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shift_assignments (
    id integer NOT NULL,
    schedule_member_id integer NOT NULL,
    shift_date date NOT NULL,
    shift_type_id integer NOT NULL
);


ALTER TABLE public.shift_assignments OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16503)
-- Name: shift_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shift_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shift_assignments_id_seq OWNER TO postgres;

--
-- TOC entry 4258 (class 0 OID 0)
-- Dependencies: 233
-- Name: shift_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shift_assignments_id_seq OWNED BY public.shift_assignments.id;


--
-- TOC entry 228 (class 1259 OID 16449)
-- Name: shift_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shift_types (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    title character varying(50) NOT NULL
);


ALTER TABLE public.shift_types OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16448)
-- Name: shift_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shift_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shift_types_id_seq OWNER TO postgres;

--
-- TOC entry 4259 (class 0 OID 0)
-- Dependencies: 227
-- Name: shift_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shift_types_id_seq OWNED BY public.shift_types.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash text NOT NULL,
    role_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4260 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4030 (class 2604 OID 16556)
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- TOC entry 4022 (class 2604 OID 16441)
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- TOC entry 4032 (class 2604 OID 16574)
-- Name: login_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs ALTER COLUMN id SET DEFAULT nextval('public.login_logs_id_seq'::regclass);


--
-- TOC entry 4028 (class 2604 OID 16485)
-- Name: nurse_schedule_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurse_schedule_members ALTER COLUMN id SET DEFAULT nextval('public.nurse_schedule_members_id_seq'::regclass);


--
-- TOC entry 4020 (class 2604 OID 16427)
-- Name: nurses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurses ALTER COLUMN id SET DEFAULT nextval('public.nurses_id_seq'::regclass);


--
-- TOC entry 4019 (class 2604 OID 16410)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4024 (class 2604 OID 16464)
-- Name: schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);


--
-- TOC entry 4029 (class 2604 OID 16507)
-- Name: shift_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_assignments ALTER COLUMN id SET DEFAULT nextval('public.shift_assignments_id_seq'::regclass);


--
-- TOC entry 4023 (class 2604 OID 16452)
-- Name: shift_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_types ALTER COLUMN id SET DEFAULT nextval('public.shift_types_id_seq'::regclass);


--
-- TOC entry 4018 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4243 (class 0 OID 16553)
-- Dependencies: 236
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, table_name, record_id, old_data, new_data, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- TOC entry 4233 (class 0 OID 16438)
-- Dependencies: 226
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name) FROM stdin;
1	ICU
2	CCU
3	Emergency
4	Internal
\.


--
-- TOC entry 4245 (class 0 OID 16571)
-- Dependencies: 238
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_logs (id, username, success, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- TOC entry 4239 (class 0 OID 16482)
-- Dependencies: 232
-- Data for Name: nurse_schedule_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nurse_schedule_members (id, schedule_id, nurse_id) FROM stdin;
\.


--
-- TOC entry 4231 (class 0 OID 16424)
-- Dependencies: 224
-- Data for Name: nurses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nurses (id, personnel_number, first_name, last_name, active) FROM stdin;
1	1054	الیاس	خداپرست	t
\.


--
-- TOC entry 4229 (class 0 OID 16407)
-- Dependencies: 222
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	Admin
2	Supervisor
3	Headnurse
4	Viewer
\.


--
-- TOC entry 4237 (class 0 OID 16461)
-- Dependencies: 230
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, department_id, year, month, status, created_at, published_at, locked_at, created_by, updated_by, updated_at) FROM stdin;
\.


--
-- TOC entry 4241 (class 0 OID 16504)
-- Dependencies: 234
-- Data for Name: shift_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shift_assignments (id, schedule_member_id, shift_date, shift_type_id) FROM stdin;
\.


--
-- TOC entry 4235 (class 0 OID 16449)
-- Dependencies: 228
-- Data for Name: shift_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shift_types (id, code, title) FROM stdin;
1	M	Morning
2	E	Evening
3	N	Night
4	M/E	Morning - Evening
5	E/N	Evening - Night
6	M/N	Morning - Night
7	O	Off
\.


--
-- TOC entry 4227 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, role_id) FROM stdin;
\.


--
-- TOC entry 4261 (class 0 OID 0)
-- Dependencies: 235
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- TOC entry 4262 (class 0 OID 0)
-- Dependencies: 225
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 4, true);


--
-- TOC entry 4263 (class 0 OID 0)
-- Dependencies: 237
-- Name: login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_logs_id_seq', 1, false);


--
-- TOC entry 4264 (class 0 OID 0)
-- Dependencies: 231
-- Name: nurse_schedule_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nurse_schedule_members_id_seq', 1, false);


--
-- TOC entry 4265 (class 0 OID 0)
-- Dependencies: 223
-- Name: nurses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nurses_id_seq', 1, true);


--
-- TOC entry 4266 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- TOC entry 4267 (class 0 OID 0)
-- Dependencies: 229
-- Name: schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedules_id_seq', 1, false);


--
-- TOC entry 4268 (class 0 OID 0)
-- Dependencies: 233
-- Name: shift_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shift_assignments_id_seq', 1, false);


--
-- TOC entry 4269 (class 0 OID 0)
-- Dependencies: 227
-- Name: shift_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shift_types_id_seq', 7, true);


--
-- TOC entry 4270 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4067 (class 2606 OID 16564)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4047 (class 2606 OID 16447)
-- Name: departments departments_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key UNIQUE (name);


--
-- TOC entry 4049 (class 2606 OID 16445)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 4069 (class 2606 OID 16581)
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4059 (class 2606 OID 16490)
-- Name: nurse_schedule_members nurse_schedule_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurse_schedule_members
    ADD CONSTRAINT nurse_schedule_members_pkey PRIMARY KEY (id);


--
-- TOC entry 4043 (class 2606 OID 16436)
-- Name: nurses nurses_personnel_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurses
    ADD CONSTRAINT nurses_personnel_number_key UNIQUE (personnel_number);


--
-- TOC entry 4045 (class 2606 OID 16434)
-- Name: nurses nurses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurses
    ADD CONSTRAINT nurses_pkey PRIMARY KEY (id);


--
-- TOC entry 4039 (class 2606 OID 16416)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4041 (class 2606 OID 16414)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4055 (class 2606 OID 16480)
-- Name: schedules schedules_department_id_year_month_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_department_id_year_month_key UNIQUE (department_id, year, month);


--
-- TOC entry 4057 (class 2606 OID 16473)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 4063 (class 2606 OID 16513)
-- Name: shift_assignments shift_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT shift_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4051 (class 2606 OID 16459)
-- Name: shift_types shift_types_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_types
    ADD CONSTRAINT shift_types_code_key UNIQUE (code);


--
-- TOC entry 4053 (class 2606 OID 16457)
-- Name: shift_types shift_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_types
    ADD CONSTRAINT shift_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4065 (class 2606 OID 16525)
-- Name: shift_assignments uq_member_date; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT uq_member_date UNIQUE (schedule_member_id, shift_date);


--
-- TOC entry 4061 (class 2606 OID 16502)
-- Name: nurse_schedule_members uq_schedule_nurse; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurse_schedule_members
    ADD CONSTRAINT uq_schedule_nurse UNIQUE (schedule_id, nurse_id);


--
-- TOC entry 4035 (class 2606 OID 16400)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4037 (class 2606 OID 16402)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4078 (class 2606 OID 16565)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4070 (class 2606 OID 16418)
-- Name: users fk_users_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 4074 (class 2606 OID 16496)
-- Name: nurse_schedule_members nurse_schedule_members_nurse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurse_schedule_members
    ADD CONSTRAINT nurse_schedule_members_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurses(id);


--
-- TOC entry 4075 (class 2606 OID 16491)
-- Name: nurse_schedule_members nurse_schedule_members_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nurse_schedule_members
    ADD CONSTRAINT nurse_schedule_members_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id) ON DELETE CASCADE;


--
-- TOC entry 4071 (class 2606 OID 16526)
-- Name: schedules schedules_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4072 (class 2606 OID 16474)
-- Name: schedules schedules_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- TOC entry 4073 (class 2606 OID 16531)
-- Name: schedules schedules_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- TOC entry 4076 (class 2606 OID 16514)
-- Name: shift_assignments shift_assignments_schedule_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT shift_assignments_schedule_member_id_fkey FOREIGN KEY (schedule_member_id) REFERENCES public.nurse_schedule_members(id) ON DELETE CASCADE;


--
-- TOC entry 4077 (class 2606 OID 16519)
-- Name: shift_assignments shift_assignments_shift_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shift_assignments
    ADD CONSTRAINT shift_assignments_shift_type_id_fkey FOREIGN KEY (shift_type_id) REFERENCES public.shift_types(id);


-- Completed on 2026-06-24 23:51:04 +0330

--
-- PostgreSQL database dump complete
--

\unrestrict vhO6pEtB1RXjo5A6VhnX7ScN3Uk1j81B9tE3AmtvsqjfOwago8fOp06qa3FMR9S

