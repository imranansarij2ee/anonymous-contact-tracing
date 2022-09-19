create table user_info
(
    user_name varchar(512) not null,
    public_id uuid not null,
    private_id uuid not null
);

/**
  ### user schema ###
 **/
create unique index user_info_private_id_uindex
    on user_info (private_id);

create unique index user_info_public_id_uindex
    on user_info (public_id);

create unique index user_info_user_name_uindex
    on user_info (user_name);

alter table user_info
    add constraint user_info_pk
        primary key (user_name);

/**
  ### user_contact ###
 **/

create table user_contact
(
    id uuid not null,
    email varchar(100) not null
);

create unique index user_contact_email_uindex
    on user_contact (email);

create unique index user_contact_id_uindex
    on user_contact (id);

alter table user_contact
    add constraint user_contact_pk
        primary key (id);


/**
  ### neo4j constraint ###
 **/
CREATE CONSTRAINT unique_private_person_identifier IF NOT EXISTS
FOR (p:Person) REQUIRE p.userId IS UNIQUE

CREATE CONSTRAINT unique_census_tract_identifier IF NOT EXISTS
FOR (c:CensusTract) REQUIRE c.identifier IS UNIQUE

MATCH (n:Person)
DETACH DELETE n

