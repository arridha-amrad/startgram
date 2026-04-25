ALTER TABLE "tagged_users" ALTER COLUMN "coordinate_x" SET DATA TYPE double precision USING "coordinate_x"::double precision;--> statement-breakpoint
ALTER TABLE "tagged_users" ALTER COLUMN "coordinate_y" SET DATA TYPE double precision USING "coordinate_y"::double precision;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;