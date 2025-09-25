import { Locator, Page } from "@playwright/test";

export class LoginPage {

  private readonly username: Locator     
  private readonly password: Locator
  private readonly loginButton: Locator

  constructor(page: Page) {
    this.username = page.getByRole('textbox', { name: 'Username' })
    this.password = page.getByRole('textbox', { name: 'Password' })
    this.loginButton = page.getByRole('button', { name: 'Log In to Sandbox' })
  };

  async loginToApp(page: Page) {
    await page.goto('https://fisagrp--dev02.sandbox.my.salesforce.com/');
    await this.username.fill('kevin.melendez@fisa.ndev02');
    await this.password.fill('Kevin123');
    await this.loginButton.click(); 
};}
