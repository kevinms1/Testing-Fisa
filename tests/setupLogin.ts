import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://fisagrp--dev02.sandbox.my.site.com/servicios/s/F');
  await page.getByRole('textbox', { name: 'Nombre de usuario' }).fill('jenifer.maltez@intellectsystem.net.dev02cliente');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Fisa2025..');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

  // Esperar a que esté logueado (puedes poner otro locator si es más confiable)
  //await page.waitForSelector('text=Crear Caso');

  await context.storageState({ path: 'storageState.json' });

  await browser.close();
}

export default globalSetup;