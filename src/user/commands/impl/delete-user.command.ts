export class DeleteUserCommand {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly phone: string,
  ) {}
}
