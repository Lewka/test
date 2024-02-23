import type { FrameLocator, Locator } from "@playwright/test";
import { PersonalInfo } from "../models/PersonalInfo";
import { step } from "./StepDecorator";

export class PayerInfoWidget {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly creditCardPaymentMethodButton: Locator;

  constructor(public readonly mainFrame: FrameLocator) {
    this.firstNameInput = this.mainFrame.locator(
      "css=[data-qa='personal-first-name']",
    );
    this.lastNameInput = this.mainFrame.locator(
      "css=[data-qa='personal-last-name']",
    );
    this.emailInput = this.mainFrame.locator("css=[data-qa='personal-email']");
    this.creditCardPaymentMethodButton = this.mainFrame.locator(
      "css=[data-testid=pay-button]",
    );
  }

  @step
  async fillPayerPersonalInfo(personalInfo: PersonalInfo) {
    await this.firstNameInput.fill(personalInfo.firstName);
    await this.lastNameInput.fill(personalInfo.lastName);
    await this.emailInput.fill(personalInfo.email);
  }

  @step
  async makeDonation() {
    await this.creditCardPaymentMethodButton.click();
  }
}
