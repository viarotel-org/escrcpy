/**
 * Result of a single agent step.
 */
export class StepResult {
  constructor(
    public success: boolean,
    public finished: boolean,
    public action: any | null,
    public thinking: string,
    public message?: string,
  ) {}
}
