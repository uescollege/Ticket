CREATE TABLE
  `igf115`.`administrators` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `avatar` TEXT NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT 1,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB;