import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1773825419630 implements MigrationInterface {
  name = 'UpdateUser1773825419630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "surname" character varying(60) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "street" character varying(60) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "zip_code" character varying(60) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "street_number" character varying(60) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "street_number"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "zip_code"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "street"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "surname"`);
  }
}
