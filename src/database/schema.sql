create table user_info
(
    user_name varchar(512) not null,
    public_id uuid not null,
    private_id uuid not null
);

create unique index user_info_private_id_uindex
    on user_info (private_id);

create unique index user_info_public_id_uindex
    on user_info (public_id);

create unique index user_info_user_name_uindex
    on user_info (user_name);

alter table user_info
    add constraint user_info_pk
        primary key (user_name);
