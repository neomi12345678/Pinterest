CREATE DATABASE Pinterest;
USE Pinterest;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        us_status BOOLEAN DEFAULT FALSE

);

CREATE TABLE Pins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_url TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
            pin_status BOOLEAN DEFAULT FALSE

);

CREATE TABLE Boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE BoardPins (
    board_id INT NOT NULL,
    pin_id INT NOT NULL,
    
    PRIMARY KEY (board_id, pin_id),
    
    FOREIGN KEY (board_id) REFERENCES Boards(id) ON DELETE CASCADE,
    FOREIGN KEY (pin_id) REFERENCES Pins(id) ON DELETE CASCADE,
            bo_status BOOLEAN DEFAULT FALSE

);

CREATE TABLE Tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE PinTags (
    pin_id INT NOT NULL,
    tag_id INT NOT NULL,
    
    PRIMARY KEY (pin_id, tag_id),
    
    FOREIGN KEY (pin_id) REFERENCES Pins(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pin_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pin_id) REFERENCES Pins(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Likes (
    user_id INT NOT NULL,
    pin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, pin_id),
    
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (pin_id) REFERENCES Pins(id) ON DELETE CASCADE
)
