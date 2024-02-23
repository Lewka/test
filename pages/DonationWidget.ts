import type { FrameLocator, Locator, Page } from "@playwright/test";
import { DonationType } from "../models/DonationType";
import { PaymentMethodType } from "../models/PaymentMethodType";
import { CreditCardWidget } from "./CreditCardWidget";
import { step } from "./StepDecorator";

export class DonationWidget {
  private readonly mainFrame: FrameLocator;
  private readonly once: Locator;
  private readonly monthly: Locator;
  private readonly amountInput: Locator;
  private readonly donateButton: Locator;
  private readonly coverFeeCheckbox: Locator;
  private readonly creditCardPaymentMethodButton: Locator;

  constructor(public readonly page: Page) {
    this.mainFrame = this.page.frameLocator("css=[title='Donation Widget']");
    this.once = this.mainFrame.locator("css=[data-qa=more-frequent-button]");
    this.monthly = this.mainFrame.locator("css=[data-qa=more-frequent-button]");
    this.amountInput = this.mainFrame.locator("css=[data-qa=amount]");
    this.donateButton = this.mainFrame.locator("css=[data-qa=donate-button]");
    this.coverFeeCheckbox = this.mainFrame.locator(
      "css=[data-qa=cover-fee-checkbox]",
    );
    this.creditCardPaymentMethodButton = this.mainFrame.locator(
      "css=[data-qa=cc-button]",
    );
  }

  @step
  async setPeriod(donationType: DonationType) {
    switch (donationType) {
      case DonationType.Once:
        await this.once.click();
        break;
      case DonationType.Monthly:
        await this.monthly.click();
        break;
    }
  }

  @step
  async setAmount(amount: number) {
    await this.amountInput.fill(amount.toString());
  }

  @step
  async donate() {
    await this.donateButton.click();
  }

  @step
  async setCoverFee(coverFee: boolean) {
    if (!coverFee) {
      await this.coverFeeCheckbox.uncheck();
    }
  }

  @step
  async setPaymentMethod(paymentMethod: PaymentMethodType) {
    switch (paymentMethod) {
      case PaymentMethodType.Card:
        await this.creditCardPaymentMethodButton.click();
        return new CreditCardWidget(this.mainFrame);
    }
  }
}
