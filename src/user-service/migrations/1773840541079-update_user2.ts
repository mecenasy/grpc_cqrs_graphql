import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser21773840541079 implements MigrationInterface {
  name = 'UpdateUser21773840541079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying(60) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "state" character varying(60) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
  }
}
