create table users
(
    user_id  varchar default uuid_generate_v4() not null
        constraint users_pkey
            primary key,
    email    varchar                            not null,
    password varchar                            not null,
    username varchar                            not null
);

INSERT INTO wra.users (user_id, email, password, username) VALUES ('f4d3c65b-d8da-4a2a-8be7-f7e402b1b262', 'lubko@lubko.sk', '$2a$10$krcG/EkcPCO1H.djT1X7Tu95T6qVCbS64YJ9rqk9YbHwQYnoMhqSy', 'lubko');
INSERT INTO wra.users (user_id, email, password, username) VALUES ('9bc6977d-f34b-4b38-b83d-22a04d84141e', 'gug@p.c', '$2a$10$4gdl.J3wNSl/s8k0yL0kZOYUdRg.OkVzZ8FVWvkF1OIF.ej75j6s2', 'pup');
INSERT INTO wra.users (user_id, email, password, username) VALUES ('91e33d69-2b71-405a-bad1-e2c8d5d25426', 'horacio@kekule.sk', '$2a$10$alRUhRdz.rA27pxbvisYh./g1Qvsg3po6QtjVgWJks9UdbxncoTCG', 'demo');