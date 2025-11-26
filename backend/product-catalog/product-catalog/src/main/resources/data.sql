INSERT INTO PRODUCTS (NAME, DESCRIPTION, PRICE, CATEGORY, RATING, IMAGE_URL, CREATED_AT, UPDATED_AT)
VALUES ('T-Shirt', 'Comfortable cotton t-shirt', 19.99, 'Clothing', 4.5, 'img1.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO PRODUCT_SIZES (PRODUCT_ID, SIZE, STOCK)
VALUES (1, 'S', 10),
       (1, 'M', 15),
       (1, 'L', 8),
       (1, 'XL', 5),
       (1, 'XXL', 3);