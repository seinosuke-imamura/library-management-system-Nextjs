CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`publisher` text NOT NULL,
	`category` text NOT NULL,
	`quantity` integer NOT NULL,
	`isbn` text NOT NULL,
	`publicationYear` integer NOT NULL,
	`stock` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rentals` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`bookId` text NOT NULL,
	`rentedDate` integer NOT NULL,
	`dueDate` integer NOT NULL,
	`returnDate` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL
);
