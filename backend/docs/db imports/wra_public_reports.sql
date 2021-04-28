create table reports
(
    report_id      varchar default uuid_generate_v4() not null
        constraint reports_pk
            primary key,
    user_id        varchar
        constraint reports_users_user_id_fk
            references users,
    characteristic varchar,
    latitude       numeric,
    longitude      numeric,
    location       varchar,
    uploadtime     timestamp,
    description    varchar,
    photo          bytea
);
