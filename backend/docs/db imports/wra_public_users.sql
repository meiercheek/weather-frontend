create table users
(
    user_id  varchar default uuid_generate_v4() not null
        constraint users_pkey
            primary key,
    email    varchar                            not null,
    password varchar                            not null,
    username varchar                            not null
);
