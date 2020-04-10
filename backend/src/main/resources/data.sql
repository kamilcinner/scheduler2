INSERT INTO users (username, password, enabled)
    values (
        'user',
        '{noop}pass',
        true
    );

INSERT INTO authorities (username, authority)
    values ('user', 'ROLE_USER');