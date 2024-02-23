import { expect, test as base } from "@playwright/test";
import { DataPage } from "../pages/DataPage";
import { DonationWidget } from "../pages/DonationWidget";
import { DonationType } from "../models/DonationType";
import { PaymentMethodType } from "../models/PaymentMethodType";
import { CreditCard } from "../models/CreditCard";
import { PersonalInfo } from "../models/PersonalInfo";

const test = base.extend<{ dataPage: DataPage }>({
  dataPage: async ({ page }, use) => {
    const dataPage = new DataPage(page);
    await use(dataPage);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("https://data.fundraiseup.com/qa-test-7R58U3/");
});

test("make donation with invalid card should throw an error", async ({
  page,
  dataPage,
}) => {
  // 1. Донор переходит на сайт
  // 2. Кликает на кнопку “Give now”
  await dataPage.openDonationPage();

  // 3. Выбирает “Monthly” пожертвование
  let donationWidget = new DonationWidget(page);
  await donationWidget.setPeriod(DonationType.Monthly);

  // 4. Вводит сумму 100 USD
  await donationWidget.setAmount(100);

  // 5. Нажимает “Donate monthly”
  await donationWidget.donate();

  // 6. Убирает чек-бокс покрытия комиссии “Cover transaction costs”
  await donationWidget.setCoverFee(false);

  // 7. Выбирает оплату кредитной картой “Credit card”
  let creditCardWidget = await donationWidget.setPaymentMethod(
    PaymentMethodType.Card,
  );

  // 8. Вводит карточные данные для оплаты
  // ```
  // Card number: **4242 4242 4242 4242**
  // Expire:      **04/24**
  // CVC:         **000**
  // ```
  let creditCard = new CreditCard("4242 4242 4242 4242", "04/24", "000");
  await creditCardWidget.fillCardDetails(creditCard);

  // 1. Нажимает “Continue”
  const payerInfoWidget = await creditCardWidget.continue();

  // 9. Вводит “First name”
  // 10. Вводит “Last name”
  // 11. Вводит “E-mail”
  let personalInfo = new PersonalInfo("Jek", "Tomsa", "isqad.bro@gmail.com");
  await payerInfoWidget.fillPayerPersonalInfo(personalInfo);

  // 12. Нажимает “Donate”
  await payerInfoWidget.makeDonation();

  // 💡 После этого шага форма оплаты должна вернуть пользователя на экран вода карточных данных и отобразить ошибку
  expect(creditCardWidget.isOpened()).toBeTruthy();
  let alert = await creditCardWidget.getAlert();
  expect(alert.title).toStrictEqual("Your card was declined");
  expect(alert.text).toStrictEqual(
    "Your card was declined. Your request was in live mode, but used a known test card.",
  );
});
