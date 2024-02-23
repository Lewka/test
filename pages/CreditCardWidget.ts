import type { FrameLocator, Locator, Page } from "@playwright/test";
import { PayerInfoWidget } from "./PayerInfoWidget";
import { CreditCard } from "../models/CreditCard";
import { step } from "./StepDecorator";
import { AlertModel } from "../models/AlertModel";

export class CreditCardWidget {
  private readonly creditCardNumberInput: Locator;
  private readonly creditCardNumberExpiryInput: Locator;
  private readonly creditCardNumberCvcInput: Locator;
  private readonly cardContinueButton: Locator;
  private readonly alertTitle: Locator;
  private readonly alertText: Locator;

  constructor(public readonly mainFrame: FrameLocator) {
    this.creditCardNumberInput = this.mainFrame
      .frameLocator("css=[title='Secure card number input frame']")
      .locator("css=[data-elements-stable-field-name=cardNumber]");
    this.creditCardNumberExpiryInput = this.mainFrame
      .frameLocator("css=[title='Secure expiration date input frame']")
      .locator("css=[data-elements-stable-field-name=cardExpiry]");
    this.creditCardNumberCvcInput = this.mainFrame
      .frameLocator("css=[title='Secure CVC input frame']")
      .locator("css=[data-elements-stable-field-name=cardCvc]");
    this.cardContinueButton = this.mainFrame.locator(
      "css=[data-qa=card-continue]",
    );
    this.alertTitle = this.mainFrame.locator(
      "css=[data-qa=card-continue-error-title]",
    );
    this.alertText = this.mainFrame.locator(
      "css=[data-qa=card-continue-error-message]",
    );
  }

  @step
  async isOpened() {
    return this.mainFrame
      .locator("css=div[class~=header-main]")
      .filter({ hasText: "Credit card" })
      .isVisible();
  }

  @step
  async fillCardDetails(creditCard: CreditCard) {
    await this.creditCardNumberInput.fill(creditCard.cardNumber);
    await this.creditCardNumberExpiryInput.fill(creditCard.expireDate);
    await this.creditCardNumberCvcInput.fill(creditCard.cvc);
  }

  @step
  async continue() {
    await this.cardContinueButton.click();
    return new PayerInfoWidget(this.mainFrame);
  }

  @step
  async getAlert() {
    return new AlertModel(
      await this.alertTitle.textContent(),
      await this.alertText.textContent(),
    );
  }
}
