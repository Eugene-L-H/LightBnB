INSERT INTO users (name, email, password)
VALUES ('One', 'one@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Two', 'two@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Three', 'three@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

--- properties

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, country, street, city, province, post_code)
VALUES (1, 'family housing', 'desription', 'https://gmail.com/p/1.jpg', 'https://gmail.com/c/1.jpg', 200, 2, 'Canada', 'str1', 'city1', 'BC', 'V6T1R9'),
 (2, 'DTES', 'desription', 'https://gmail.com/p/2.jpg', 'https://gmail.com/c/2.jpg', 5, 0, 'Canada', 'str2', 'city2', 'BC', 'V2T2R2'),
 (3, 'SW MARINE Drive', 'desription', 'https://gmail.com/p/3.jpg', 'https://gmail.com/c/3.jpg', 600, 4, 'Canada', 'str3', 'city3', 'BC', 'V3T3R3'),
 (3, 'YVR', 'desription', 'https://gmail.com/p/4.jpg', 'https://gmail.com/c/4.jpg', 150, 1, 'Canada', 'str4', 'city4', 'BC', 'V4T4R4');


--- reservations 

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-12', 4, 1),
 ('2019-09-11', '2019-09-12', 3, 2),
 ('2020-09-11', '2020-09-12', 3, 3);

-- property reviews

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 3, 1, 3, 'messages'),
 (1, 4, 2, 4, 'messages'),
 (3, 3, 3, 5, 'messages');