import type { Page, Locator, FrameLocator } from "@playwright/test";
import { step } from "./StepDecorator";

export class DataPage {
  private readonly mainFrame: FrameLocator;
  private readonly giveNowButton: Locator;

  constructor(public readonly page: Page) {
    this.mainFrame = this.page.frameLocator("css=[title='Donate Button']");
    this.giveNowButton = this.mainFrame.locator(
      "css=[data-qa=donate-button-label]",
    );
  }

  @step
  async openDonationPage() {
    await this.giveNowButton.click();
  }
}
