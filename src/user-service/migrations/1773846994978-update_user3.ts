import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser31773846994978 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "users" (id, email, name, surname, phone, street, city, state, zip_code, "street_number")
SELECT 
    gen_random_uuid(), -- Generuje unikalne ID
    'user' || i || '@' || (ARRAY['gmail.com', 'outlook.com', 'poczta.pl'])[floor(random() * 3 + 1)]::text,
    (ARRAY['Jan', 'Adam', 'Piotr', 'Marek', 'Krzysztof', 'Anna', 'Maria', 'Katarzyna', 'Magdalena', 'Ewa'])[floor(random() * 10 + 1)]::text,
    (ARRAY['Nowak', 'Kowalski', 'Wisniewski', 'Wojcik', 'Mazur', 'Lewandowski', 'Dabrowski', 'Zajac', 'Krol', 'Wieczorek'])[floor(random() * 10 + 1)]::text,
    '+48' || (floor(random() * 900000000 + 100000000))::text,
    (ARRAY['Mickiewicza', 'Slowackiego', 'Dluga', 'Krotka', 'Polna', 'Leśna', 'Sloneczna', 'Kwiatowa'])[floor(random() * 8 + 1)]::text,
    (ARRAY['Warszawa', 'Krakow', 'Wroclaw', 'Poznan', 'Gdansk', 'Lublin', 'Szczecin', 'Krzywaczka'])[floor(random() * 8 + 1)]::text,
    (ARRAY['Mazowieckie', 'Malopolskie', 'Dolnoslaskie', 'Wielkopolskie', 'Pomorskie'])[floor(random() * 5 + 1)]::text,
    (floor(random() * 90 + 10))::text || '-' || (floor(random() * 900 + 100))::text,
    (floor(random() * 150 + 1))::text
FROM generate_series(1, 300) s(i);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
