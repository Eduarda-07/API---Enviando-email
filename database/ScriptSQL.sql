create database Mesa_Plus;
use Mesa_Plus;
show tables;


drop database Mesa_Plus;

create database Mesa_Plus;
use Mesa_Plus;
show tables;


create table tbl_usuarios(
    id int auto_increment primary key,
    nome varchar(200) not null,
    email varchar(150) not null unique,
    senha text not null,
    cpf varchar (15) not null unique,
    telefone varchar (20) not null,
    foto text null,
    data_modificacao DATETIME,
    codigo_recuperacao text,
    codigo_expiracao datetime
);

create table tbl_empresas(
    id int auto_increment primary key,
    nome varchar(200) not null,
    email varchar(150) not null unique,
    senha text not null,
    cnpj_mei varchar (20) not null unique,
    telefone varchar (20) not null,
    foto text null,
    data_modificacao DATETIME,
    codigo_recuperacao text,
    codigo_expiracao datetime
);

create table tbl_ongs (
    id int auto_increment primary key,
    nome varchar(200) not null,
    email varchar(150) not null unique,
    senha text not null,
    telefone varchar (20) not null,
    foto text null,
    data_modificacao DATETIME,
    codigo_recuperacao text,
    codigo_expiracao datetime
);